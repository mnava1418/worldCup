import type { Match } from '../types'
import { getBestThirds, calculateGroupStandings } from './standings'
import { getThirdPlacePlacements } from './thirdPlacePlacements'

// Maps each R32/R16/QF/SF match winner to which next match/slot they feed into
const WINNER_FEEDS: Record<number, { toMatch: number; slot: 'team1' | 'team2' }> = {
  // R32 → R16
  73: { toMatch: 90, slot: 'team1' },
  74: { toMatch: 89, slot: 'team1' },
  75: { toMatch: 90, slot: 'team2' },
  76: { toMatch: 91, slot: 'team1' },
  77: { toMatch: 89, slot: 'team2' },
  78: { toMatch: 91, slot: 'team2' },
  79: { toMatch: 92, slot: 'team1' },
  80: { toMatch: 92, slot: 'team2' },
  81: { toMatch: 94, slot: 'team1' },
  82: { toMatch: 94, slot: 'team2' },
  83: { toMatch: 93, slot: 'team1' },
  84: { toMatch: 93, slot: 'team2' },
  85: { toMatch: 96, slot: 'team1' },
  86: { toMatch: 95, slot: 'team1' },
  87: { toMatch: 96, slot: 'team2' },
  88: { toMatch: 95, slot: 'team2' },
  // R16 → QF
  89: { toMatch: 97, slot: 'team1' },
  90: { toMatch: 97, slot: 'team2' },
  91: { toMatch: 99, slot: 'team1' },
  92: { toMatch: 99, slot: 'team2' },
  93: { toMatch: 98, slot: 'team1' },
  94: { toMatch: 98, slot: 'team2' },
  95: { toMatch: 100, slot: 'team1' },
  96: { toMatch: 100, slot: 'team2' },
  // QF → SF
  97: { toMatch: 101, slot: 'team1' },
  98: { toMatch: 101, slot: 'team2' },
  99: { toMatch: 102, slot: 'team1' },
  100: { toMatch: 102, slot: 'team2' },
}

// SF losers → 3rd place match (103)
const LOSER_FEEDS: Record<number, { toMatch: number; slot: 'team1' | 'team2' }> = {
  101: { toMatch: 103, slot: 'team1' },
  102: { toMatch: 103, slot: 'team2' },
}

// SF winners → Final (104)
const SF_WINNER_FEEDS: Record<number, { toMatch: number; slot: 'team1' | 'team2' }> = {
  101: { toMatch: 104, slot: 'team1' },
  102: { toMatch: 104, slot: 'team2' },
}

export function getMatchWinner(match: Match): string | undefined {
  if (match.score1 === undefined || match.score2 === undefined) return undefined
  if (match.score1 > match.score2) return match.team1
  if (match.score2 > match.score1) return match.team2
  if (match.score1ET !== undefined && match.score2ET !== undefined) {
    if (match.score1ET > match.score2ET) return match.team1
    if (match.score2ET > match.score1ET) return match.team2
    if (match.penaltyWinner === 'team1') return match.team1
    if (match.penaltyWinner === 'team2') return match.team2
  }
  return undefined
}

export function getMatchLoser(match: Match): string | undefined {
  const winner = getMatchWinner(match)
  if (!winner) return undefined
  return winner === match.team1 ? match.team2 : match.team1
}

/**
 * Resolves placeholder team names ("1A", "2B", "3C") to actual team names
 * using group standings computed from match results.
 */
function buildGroupRankings(matches: Match[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const grp of 'ABCDEFGHIJKL'.split('')) {
    const hasMatches = matches.some(m => m.phase === 'group' && m.group === grp)
    if (!hasMatches) continue
    const standings = calculateGroupStandings(matches, grp)
    map.set(grp, standings.map(s => s.team))
  }
  return map
}

function resolvePlaceholder(placeholder: string, groupRankings: Map<string, string[]>): string {
  const m = placeholder.match(/^([123])([A-L])$/)
  if (!m) return placeholder
  const rank = parseInt(m[1], 10) - 1
  const teams = groupRankings.get(m[2])
  return teams?.[rank] ?? placeholder
}

/**
 * Resolves the full bracket from group stage results:
 * - Fills "1A"/"2B"/"3C" placeholders with real team names
 * - Assigns third-place qualifiers to their R32 slots
 * - Propagates winners through all rounds
 */
export function resolveBracket(matches: Match[]): Match[] {
  const byNum = new Map<number, Match>()
  matches.forEach(m => { if (m.num) byNum.set(m.num, { ...m }) })

  const groupRankings = buildGroupRankings(matches)

  // Resolve group-position placeholders in all knockout matches
  for (const [, m] of byNum) {
    if (m.phase === 'group') continue
    m.team1 = resolvePlaceholder(m.team1, groupRankings)
    m.team2 = resolvePlaceholder(m.team2, groupRankings)
  }

  // Resolve third-place assignments for R32 slots that use thirds
  const bestThirds = getBestThirds(matches)
  if (bestThirds.length === 8) {
    const advancingGroups = bestThirds.map(t => t.group)
    const placements = getThirdPlacePlacements(advancingGroups)
    if (placements) {
      const thirdByGroup = new Map(bestThirds.map(t => [t.group, t.team]))
      const slotToMatchNum: Record<string, number> = {
        M74: 74, M77: 77, M79: 79, M80: 80, M81: 81, M82: 82, M85: 85, M87: 87,
      }
      for (const [slot, group] of Object.entries(placements)) {
        const matchNum = slotToMatchNum[slot]
        const m = byNum.get(matchNum)
        const team = thirdByGroup.get(group)
        if (m && team) m.team2 = team
      }
    }
  }

  // Propagate winners forward through the bracket
  for (const num of [
    73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88,
    89, 90, 91, 92, 93, 94, 95, 96,
    97, 98, 99, 100,
    101, 102,
  ]) {
    const m = byNum.get(num)
    if (!m) continue

    const winner = getMatchWinner(m)
    if (winner) {
      const feed = WINNER_FEEDS[num]
      if (feed) {
        const target = byNum.get(feed.toMatch)
        if (target) target[feed.slot] = winner
      }
      const sfFeed = SF_WINNER_FEEDS[num]
      if (sfFeed) {
        const target = byNum.get(sfFeed.toMatch)
        if (target) target[sfFeed.slot] = winner
      }
    }

    const loser = getMatchLoser(m)
    if (loser) {
      const lFeed = LOSER_FEEDS[num]
      if (lFeed) {
        const target = byNum.get(lFeed.toMatch)
        if (target) target[lFeed.slot] = loser
      }
    }
  }

  return matches.map(m => (m.num && byNum.has(m.num) ? byNum.get(m.num)! : m))
}
