import { useState, useMemo } from 'react'
import { useMatches } from '../hooks/useMatches'
import { useAuth } from '../context/AuthContext'
import MatchCard from '../components/fixture/MatchCard'
import ScoreModal from '../components/ScoreModal'
import type { Match } from '../types'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function FixturePage() {
  const { matches, loading, saveScore } = useMatches()
  const { user } = useAuth()
  const [selected, setSelected] = useState<Match | null>(null)
  const [filterDate, setFilterDate] = useState<string>('')
  const [filterTeam, setFilterTeam] = useState<string>('')

  const sorted = useMemo(() => [...matches].sort((a, b) => a.utcMs - b.utcMs), [matches])

  const dates = useMemo(() => {
    const seen = new Set<string>()
    sorted.forEach(m => seen.add(m.date))
    return [...seen].sort()
  }, [sorted])

  const teams = useMemo(() => {
    const seen = new Set<string>()
    const isPlaceholder = (t: string) => /^\d[A-Za-z]|^[WL]\d+|\//.test(t)
    sorted.forEach(m => {
      if (!isPlaceholder(m.team1)) seen.add(m.team1)
      if (!isPlaceholder(m.team2)) seen.add(m.team2)
    })
    return [...seen].sort()
  }, [sorted])

  const filtered = useMemo(() => {
    return sorted.filter(m => {
      if (filterDate && m.date !== filterDate) return false
      if (filterTeam && m.team1 !== filterTeam && m.team2 !== filterTeam) return false
      return true
    })
  }, [sorted, filterDate, filterTeam])

  const byDate = useMemo(() => {
    return filtered.reduce<Record<string, Match[]>>((acc, m) => {
      acc[m.date] = acc[m.date] ?? []
      acc[m.date].push(m)
      return acc
    }, {})
  }, [filtered])

  const visibleDates = Object.keys(byDate).sort()

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-white font-semibold text-lg mb-4">Fixture completo</h1>

      <div className="flex gap-2 mb-6">
        <select
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="flex-1 bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-slate-500"
        >
          <option value="">Todos los días</option>
          {dates.map(d => (
            <option key={d} value={d}>{formatDateShort(d)}</option>
          ))}
        </select>

        <select
          value={filterTeam}
          onChange={e => setFilterTeam(e.target.value)}
          className="flex-1 bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-slate-500"
        >
          <option value="">Todos los países</option>
          {teams.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {visibleDates.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-8">No hay partidos con ese filtro.</p>
      )}

      <div className="space-y-6">
        {visibleDates.map(date => (
          <div key={date}>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2 capitalize">
              {formatDate(date)}
            </p>
            <div className="space-y-2">
              {byDate[date].map(m => (
                <MatchCard key={m.id} match={m} editable={!!user} onClick={() => setSelected(m)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ScoreModal
          match={selected}
          editable={!!user}
          onSave={u => saveScore(selected.id, u)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
