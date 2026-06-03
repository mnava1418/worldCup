import type { Match } from '../../types'
import { getMatchWinner } from '../../lib/bracketLogic'
import { useTimezone } from '../../context/TimezoneContext'
import Flag from '../Flag'

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]}`
}

interface Props {
  match: Match
  onClick: () => void
  compact?: boolean
  editable?: boolean
}

export default function BracketMatch({ match, onClick, compact, editable = false }: Props) {
  const winner = getMatchWinner(match)
  const hasScore = match.score1 !== undefined
  const { formatTime, label } = useTimezone()

  const team = (name: string, scoreVal: number | undefined, isWinner: boolean) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 ${isWinner ? 'text-white' : 'text-slate-400'}`}>
      <Flag team={name} className="shrink-0" />
      <span className={`text-xs truncate flex-1 max-w-[80px] ${compact ? 'text-[10px]' : ''}`}>
        {name || 'TBD'}
      </span>
      {hasScore && (
        <span className={`text-xs font-mono font-semibold shrink-0 ${isWinner ? 'text-white' : 'text-slate-500'}`}>
          {scoreVal}
        </span>
      )}
    </div>
  )

  return (
    <button
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 rounded overflow-hidden transition-colors w-full text-left ${editable ? 'hover:border-slate-600 cursor-pointer' : 'cursor-default'}`}
      style={{ minWidth: compact ? 120 : 150 }}
    >
      <div className="bg-slate-800/50 px-2 py-0.5 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500">M{match.num}</span>
        {match.utcMs > 0 && (
          <span className="text-[10px] text-slate-500 shrink-0">
            {formatShortDate(match.date)} · {formatTime(match.utcMs)} {label}
          </span>
        )}
      </div>
      <div className="divide-y divide-slate-800">
        {team(match.team1, match.score1, winner === match.team1)}
        {team(match.team2, match.score2, winner === match.team2)}
      </div>
      {match.score1ET !== undefined && (
        <div className="px-2 py-0.5 bg-slate-800/30 border-t border-slate-800">
          <span className="text-[9px] text-slate-500">
            TE {match.score1ET}–{match.score2ET}
            {match.penaltyWinner && ` · Pen`}
          </span>
        </div>
      )}
    </button>
  )
}
