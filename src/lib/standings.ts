import type { Match, Standing } from '../types'

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

function emptyStanding(team: string): Standing {
  return { team, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, gd: 0, yellowCards: 0, redCards: 0 }
}

function addMatchResult(s: Standing, goalsFor: number, goalsAgainst: number): void {
  s.pj++
  s.gf += goalsFor
  s.gc += goalsAgainst
  s.gd += goalsFor - goalsAgainst
  if (goalsFor > goalsAgainst) { s.pts += 3; s.pg++ }
  else if (goalsFor === goalsAgainst) { s.pts += 1; s.pe++ }
  else { s.pp++ }
}

function compareStandings(a: Standing, b: Standing): number {
  if (b.pts !== a.pts) return b.pts - a.pts
  if (b.gd !== a.gd) return b.gd - a.gd
  if (b.gf !== a.gf) return b.gf - a.gf
  // Fair play
  const fairA = a.yellowCards + a.redCards * 3
  const fairB = b.yellowCards + b.redCards * 3
  return fairA - fairB
}

export function calculateGroupStandings(matches: Match[], group: string): Standing[] {
  const groupMatches = matches.filter(
    m => m.phase === 'group' && m.group === group && m.score1 !== undefined
  )

  const standings = new Map<string, Standing>()

  const ensureTeam = (team: string) => {
    if (!standings.has(team)) standings.set(team, emptyStanding(team))
    return standings.get(team)!
  }

  for (const m of groupMatches) {
    const s1 = ensureTeam(m.team1)
    const s2 = ensureTeam(m.team2)
    addMatchResult(s1, m.score1!, m.score2!)
    addMatchResult(s2, m.score2!, m.score1!)
  }

  // Ensure all 4 teams appear even with 0 points
  const allTeams = new Set<string>()
  matches
    .filter(m => m.phase === 'group' && m.group === group)
    .forEach(m => { allTeams.add(m.team1); allTeams.add(m.team2) })
  allTeams.forEach(t => { if (!standings.has(t)) standings.set(t, emptyStanding(t)) })

  const sorted = Array.from(standings.values()).sort((a, b) => {
    const primary = compareStandings(a, b)
    if (primary !== 0) return primary
    // Head-to-head among tied teams
    const tied = Array.from(standings.values()).filter(
      s => s.pts === a.pts && s.gd === a.gd && s.gf === a.gf
    )
    if (tied.length < 2) return 0
    const tiedNames = new Set(tied.map(s => s.team))
    const h2hMatches = groupMatches.filter(
      m => tiedNames.has(m.team1) && tiedNames.has(m.team2)
    )
    const h2h = new Map<string, Standing>()
    tiedNames.forEach(t => h2h.set(t, emptyStanding(t)))
    for (const m of h2hMatches) {
      addMatchResult(h2h.get(m.team1)!, m.score1!, m.score2!)
      addMatchResult(h2h.get(m.team2)!, m.score2!, m.score1!)
    }
    return compareStandings(h2h.get(a.team)!, h2h.get(b.team)!)
  })

  return sorted
}

export function getAllGroups(): string[] {
  return GROUPS
}

export function getGroupTeams(matches: Match[], group: string): string[] {
  const teams = new Set<string>()
  matches
    .filter(m => m.phase === 'group' && m.group === group)
    .forEach(m => { teams.add(m.team1); teams.add(m.team2) })
  return Array.from(teams)
}

export function getBestThirds(matches: Match[]): Array<{ group: string; team: string; standing: Standing }> {
  const thirds: Array<{ group: string; team: string; standing: Standing }> = []

  for (const group of GROUPS) {
    const standings = calculateGroupStandings(matches, group)
    // Only include if group has played at least some matches
    if (standings.length >= 3 && standings[2].pj > 0) {
      thirds.push({ group, team: standings[2].team, standing: standings[2] })
    }
  }

  thirds.sort((a, b) => {
    const sa = a.standing
    const sb = b.standing
    if (sb.pts !== sa.pts) return sb.pts - sa.pts
    if (sb.gd !== sa.gd) return sb.gd - sa.gd
    if (sb.gf !== sa.gf) return sb.gf - sa.gf
    const fairA = sa.yellowCards + sa.redCards * 3
    const fairB = sb.yellowCards + sb.redCards * 3
    return fairA - fairB
  })

  return thirds.slice(0, 8)
}
