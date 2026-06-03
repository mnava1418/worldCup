import { useState } from 'react'
import type { Match } from '../../types'
import { calculateGroupStandings } from '../../lib/standings'
import { useTimezone } from '../../context/TimezoneContext'
import StandingsTable from './StandingsTable'
import ScoreModal from '../ScoreModal'
import Flag from '../Flag'

interface Props {
  group: string
  matches: Match[]
  onSave: (matchId: string, updates: Partial<Match>) => Promise<void>
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
}

export default function GroupCard({ group, matches, onSave }: Props) {
  const [selected, setSelected] = useState<Match | null>(null)
  const { formatTime, label } = useTimezone()
  const standings = calculateGroupStandings(matches, group)
  const groupMatches = matches
    .filter(m => m.phase === 'group' && m.group === group)
    .sort((a, b) => a.utcMs - b.utcMs)

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800">
          <h2 className="text-white font-semibold text-sm">Grupo {group}</h2>
        </div>

        <div className="px-4 py-3 border-b border-slate-800">
          <StandingsTable standings={standings} />
        </div>

        <div className="divide-y divide-slate-800">
          {groupMatches.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-slate-800/50 transition-colors text-left"
            >
              <span className="text-slate-500 text-xs w-24 shrink-0">
                {formatDate(m.date)} {formatTime(m.utcMs)} {label}
              </span>
              <span className={`text-xs flex-1 flex items-center justify-end gap-1 min-w-0 ${m.score1 !== undefined ? 'text-white' : 'text-slate-400'}`}>
                <span className="truncate">{m.team1}</span>
                <Flag team={m.team1} />
              </span>
              <span className="text-slate-400 text-xs font-mono shrink-0 w-12 text-center">
                {m.score1 !== undefined ? `${m.score1} – ${m.score2}` : '– – –'}
              </span>
              <span className={`text-xs flex-1 flex items-center gap-1 min-w-0 ${m.score1 !== undefined ? 'text-white' : 'text-slate-400'}`}>
                <Flag team={m.team2} />
                <span className="truncate">{m.team2}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <ScoreModal
          match={selected}
          onSave={u => onSave(selected.id, u)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
