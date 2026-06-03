import type { Match } from '../../types'

interface Props {
  match: Match
  onClick: () => void
}

const PHASE_LABELS: Record<string, string> = {
  group: '',
  r32: 'R32',
  r16: 'R16',
  qf: 'Cuartos',
  sf: 'Semifinal',
  third: '3° Lugar',
  final: 'Final',
}

export default function MatchCard({ match, onClick }: Props) {
  const hasScore = match.score1 !== undefined
  const phaseLabel = PHASE_LABELS[match.phase] ?? ''

  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex items-center gap-3 hover:border-slate-700 hover:bg-slate-800/50 transition-colors text-left"
    >
      {/* Time + venue */}
      <div className="shrink-0 w-20">
        <p className="text-xs text-slate-500">{match.timeCT} CT</p>
        {phaseLabel && <p className="text-xs text-slate-600 mt-0.5">{phaseLabel}</p>}
      </div>

      {/* Teams + score */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm flex-1 truncate text-right ${hasScore ? 'text-white' : 'text-slate-400'}`}>
            {match.team1}
          </span>
          <span className="text-slate-400 text-sm font-mono shrink-0 w-14 text-center">
            {hasScore ? `${match.score1} – ${match.score2}` : '– – –'}
          </span>
          <span className={`text-sm flex-1 truncate ${hasScore ? 'text-white' : 'text-slate-400'}`}>
            {match.team2}
          </span>
        </div>
        {match.score1ET !== undefined && (
          <p className="text-xs text-slate-500 text-center mt-0.5">
            TE: {match.score1ET} – {match.score2ET}
            {match.penaltyWinner && ` · Pen: ${match.penaltyWinner === 'team1' ? match.team1 : match.team2}`}
          </p>
        )}
      </div>

      {/* Ground */}
      <div className="shrink-0 hidden sm:block text-right w-28">
        <p className="text-xs text-slate-600 truncate">{match.ground}</p>
      </div>
    </button>
  )
}
