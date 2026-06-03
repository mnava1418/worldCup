import { useState } from 'react'
import { useMatches } from '../hooks/useMatches'
import { useAuth } from '../context/AuthContext'
import MatchCard from '../components/fixture/MatchCard'
import ScoreModal from '../components/ScoreModal'
import type { Match } from '../types'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export default function FixturePage() {
  const { matches, loading, saveScore } = useMatches()
  const { user } = useAuth()
  const [selected, setSelected] = useState<Match | null>(null)

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
      </div>
    )
  }

  const sorted = [...matches].sort((a, b) => a.utcMs - b.utcMs)

  const byDate = sorted.reduce<Record<string, Match[]>>((acc, m) => {
    acc[m.date] = acc[m.date] ?? []
    acc[m.date].push(m)
    return acc
  }, {})

  const dates = Object.keys(byDate).sort()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-white font-semibold text-lg mb-6">Fixture completo</h1>
      <div className="space-y-6">
        {dates.map(date => (
          <div key={date}>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2 capitalize">
              {formatDate(date)}
            </p>
            <div className="space-y-2">
              {byDate[date].map(m => (
                <MatchCard key={m.id} match={m} editable={!!user} onClick={() => user && setSelected(m)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ScoreModal
          match={selected}
          onSave={u => saveScore(selected.id, u)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
