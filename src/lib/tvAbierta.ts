import type { Match } from '../types'

interface TVMatch {
  date: string       // YYYY-MM-DD
  teams: [string, string]  // orden no importa
}

const TV_MATCHES: TVMatch[] = [
  { date: '2026-06-11', teams: ['Mexico', 'South Africa'] },
  { date: '2026-06-12', teams: ['USA', 'Paraguay'] },
  { date: '2026-06-13', teams: ['Brazil', 'Morocco'] },
  { date: '2026-06-14', teams: ['Netherlands', 'Japan'] },
  { date: '2026-06-16', teams: ['Argentina', 'Algeria'] },
  { date: '2026-06-17', teams: ['England', 'Croatia'] },
  { date: '2026-06-18', teams: ['Mexico', 'South Korea'] },
  { date: '2026-06-19', teams: ['Brazil', 'Haiti'] },
  { date: '2026-06-20', teams: ['Netherlands', 'Sweden'] },
  { date: '2026-06-21', teams: ['Spain', 'Saudi Arabia'] },
  { date: '2026-06-22', teams: ['Norway', 'Senegal'] },
  { date: '2026-06-23', teams: ['Colombia', 'DR Congo'] },
  { date: '2026-06-24', teams: ['Mexico', 'Czech Republic'] },
  { date: '2026-06-25', teams: ['Ecuador', 'Germany'] },
  { date: '2026-06-26', teams: ['Uruguay', 'Spain'] },
  { date: '2026-06-27', teams: ['Panama', 'England'] },
  { date: '2026-06-27', teams: ['Colombia', 'Portugal'] },
]

export function isOnTVAbierta(match: Match): boolean {
  return TV_MATCHES.some(
    tv =>
      tv.date === match.date &&
      ((tv.teams[0] === match.team1 && tv.teams[1] === match.team2) ||
       (tv.teams[0] === match.team2 && tv.teams[1] === match.team1))
  )
}
