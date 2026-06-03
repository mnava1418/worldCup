import { doc, getDoc, setDoc, writeBatch, collection } from 'firebase/firestore'
import { db } from './firebase'
import type { Match, Phase } from '../types'
import { toZonedTime, format } from 'date-fns-tz'

const FIXTURE_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
const CT_ZONE = 'America/Chicago'

function parseTimeCT(dateStr: string, timeStr: string): string {
  // timeStr format: "13:00 UTC-6" or "20:00 UTC-5"
  const match = timeStr.match(/^(\d{2}):(\d{2})\s+UTC([+-]\d+)$/)
  if (!match) return timeStr
  const [, hh, mm, offsetStr] = match
  const offsetHours = parseInt(offsetStr, 10)
  // Build ISO string in UTC
  const utcMs =
    new Date(`${dateStr}T${hh}:${mm}:00Z`).getTime() - offsetHours * 3_600_000
  const ct = toZonedTime(new Date(utcMs), CT_ZONE)
  return format(ct, 'HH:mm', { timeZone: CT_ZONE })
}

function roundToPhase(round: string): Phase {
  if (round.startsWith('Matchday')) return 'group'
  if (round === 'Round of 32') return 'r32'
  if (round === 'Round of 16') return 'r16'
  if (round === 'Quarter-final') return 'qf'
  if (round === 'Semi-final') return 'sf'
  if (round === 'Match for third place') return 'third'
  if (round === 'Final') return 'final'
  return 'group'
}

function extractGroup(groupStr?: string): string | undefined {
  if (!groupStr) return undefined
  // "Group A" → "A"
  return groupStr.replace('Group ', '').trim()
}

export async function loadFixtureIfNeeded(): Promise<void> {
  const configRef = doc(db, 'config', 'app')
  const configSnap = await getDoc(configRef)
  if (configSnap.exists() && configSnap.data()?.initialized) return

  const res = await fetch(FIXTURE_URL)
  const json = await res.json()
  const rawMatches: Record<string, unknown>[] = json.matches

  const matches: Match[] = []
  let groupMatchIndex = 0

  for (const raw of rawMatches) {
    const round = raw.round as string
    const phase = roundToPhase(round)
    const dateStr = raw.date as string
    const timeStr = (raw.time as string) ?? '00:00 UTC+0'
    const num = raw.num as number | undefined

    let id: string
    if (num) {
      id = `M${num}`
    } else {
      groupMatchIndex++
      id = `GM${groupMatchIndex}`
    }

    const match: Match = {
      id,
      num: num ?? groupMatchIndex,
      round,
      phase,
      date: dateStr,
      timeCT: parseTimeCT(dateStr, timeStr),
      team1: raw.team1 as string,
      team2: raw.team2 as string,
      ground: raw.ground as string,
      ...(raw.group ? { group: extractGroup(raw.group as string) } : {}),
    }

    // Assign num 103/104 to third place / final
    if (phase === 'third') match.num = 103
    if (phase === 'final') match.num = 104

    matches.push(match)
  }

  // Batch write — Firestore limit is 500 ops per batch
  const BATCH_SIZE = 450
  for (let i = 0; i < matches.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    const chunk = matches.slice(i, i + BATCH_SIZE)
    for (const m of chunk) {
      batch.set(doc(collection(db, 'matches'), m.id), m)
    }
    await batch.commit()
  }

  await setDoc(configRef, { initialized: true })
}
