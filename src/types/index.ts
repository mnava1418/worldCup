export type Phase = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final'

export interface Match {
  id: string
  num: number
  round: string
  phase: Phase
  date: string
  timeCT: string
  team1: string
  team2: string
  group?: string
  ground: string
  score1?: number
  score2?: number
  score1ET?: number
  score2ET?: number
  penaltyWinner?: 'team1' | 'team2'
}

export interface Standing {
  team: string
  pts: number
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  gd: number
  yellowCards: number
  redCards: number
}

export interface ThirdPlaceSlots {
  M74: string
  M77: string
  M79: string
  M80: string
  M81: string
  M82: string
  M85: string
  M87: string
}
