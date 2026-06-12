import { useState, useEffect } from 'react'
import type { Match } from '../types'
import Flag from './Flag'

interface Props {
  match: Match
  editable: boolean
  onSave: (updates: Partial<Match>) => Promise<void>
  onClose: () => void
}

export default function ScoreModal({ match, editable, onSave, onClose }: Props) {
  const isKnockout = match.phase !== 'group'

  const [s1, setS1] = useState(match.score1 !== undefined ? String(match.score1) : '')
  const [s2, setS2] = useState(match.score2 !== undefined ? String(match.score2) : '')
  const [hasET, setHasET] = useState(match.score1ET !== undefined)
  const [et1, setEt1] = useState(match.score1ET !== undefined ? String(match.score1ET) : '')
  const [et2, setEt2] = useState(match.score2ET !== undefined ? String(match.score2ET) : '')
  const [hasPen, setHasPen] = useState(match.penaltyWinner !== undefined)
  const [penWinner, setPenWinner] = useState<'team1' | 'team2' | ''>(match.penaltyWinner ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const score1 = parseInt(s1, 10)
  const score2 = parseInt(s2, 10)
  const isDraw = !isNaN(score1) && !isNaN(score2) && score1 === score2

  useEffect(() => {
    if (!isDraw || !isKnockout) {
      setHasET(false)
      setHasPen(false)
    }
  }, [isDraw, isKnockout])

  async function handleSave() {
    if (s1 === '' || s2 === '') return
    setSaving(true)
    setError(null)
    try {
      const updates: Partial<Match> = {
        score1: parseInt(s1, 10),
        score2: parseInt(s2, 10),
      }
      if (isKnockout && hasET && et1 !== '' && et2 !== '') {
        updates.score1ET = parseInt(et1, 10)
        updates.score2ET = parseInt(et2, 10)
      } else {
        updates.score1ET = undefined
        updates.score2ET = undefined
        updates.penaltyWinner = undefined
      }
      if (isKnockout && hasET && hasPen && penWinner) {
        updates.penaltyWinner = penWinner
      } else if (!hasPen) {
        updates.penaltyWinner = undefined
      }
      await onSave(updates)
      onClose()
    } catch (err) {
      console.error('Error saving score:', err)
      setError('Error al guardar. Verifica la conexión.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-xs text-slate-500 mb-1">{match.round} · {match.ground}</p>
            <p className="text-white font-medium flex items-center gap-1.5 flex-wrap">
              {match.team1}
              <span className="text-slate-500">vs</span>
              {match.team2}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Regulation time */}
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Resultado</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 flex items-center gap-1 truncate"><Flag team={match.team1} />{match.team1}</label>
            <input
              type="number"
              min={0}
              value={s1}
              onChange={e => editable && setS1(e.target.value)}
              readOnly={!editable}
              className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center text-lg focus:outline-none ${editable ? 'focus:border-slate-500' : 'cursor-default opacity-70'}`}
            />
          </div>
          <span className="text-slate-600 text-xl pt-5">—</span>
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1 flex items-center gap-1 truncate"><Flag team={match.team2} />{match.team2}</label>
            <input
              type="number"
              min={0}
              value={s2}
              onChange={e => editable && setS2(e.target.value)}
              readOnly={!editable}
              className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center text-lg focus:outline-none ${editable ? 'focus:border-slate-500' : 'cursor-default opacity-70'}`}
            />
          </div>
        </div>

        {/* Extra time (knockout + draw) */}
        {editable && isKnockout && isDraw && (
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={hasET}
                onChange={e => setHasET(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
              />
              Tiempo extra
            </label>
            {hasET && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number"
                    min={0}
                    value={et1}
                    onChange={e => setEt1(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-slate-500"
                  />
                  <span className="text-slate-600">—</span>
                  <input
                    type="number"
                    min={0}
                    value={et2}
                    onChange={e => setEt2(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-slate-500"
                  />
                </div>
                {et1 !== '' && et2 !== '' && parseInt(et1, 10) === parseInt(et2, 10) && (
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={hasPen}
                        onChange={e => setHasPen(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      Penales
                    </label>
                    {hasPen && (
                      <div className="flex gap-3">
                        {(['team1', 'team2'] as const).map(slot => (
                          <button
                            key={slot}
                            onClick={() => setPenWinner(slot)}
                            className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                              penWinner === slot
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {slot === 'team1' ? match.team1 : match.team2}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-xs mb-3 text-center">{error}</p>
        )}
        {editable ? (
          <button
            onClick={handleSave}
            disabled={saving || s1 === '' || s2 === ''}
            className="w-full py-2.5 bg-white text-slate-900 font-medium rounded-lg text-sm hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
