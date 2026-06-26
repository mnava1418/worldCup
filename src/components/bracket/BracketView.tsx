import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Match } from '../../types'
import { resolveBracket } from '../../lib/bracketLogic'
import { useAuth } from '../../context/AuthContext'
import BracketMatch from './BracketMatch'
import ScoreModal from '../ScoreModal'

interface Props {
  matches: Match[]
  onSave: (matchId: string, updates: Partial<Match>) => Promise<void>
}

const SLOT_HEIGHT = 76 // px per R32 slot
const TOTAL_HEIGHT = 16 * SLOT_HEIGHT // 1216px

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col shrink-0" style={{ height: TOTAL_HEIGHT }}>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-center">{title}</p>
      <div className="flex flex-col justify-around flex-1" style={{ gap: 0 }}>
        {children}
      </div>
    </div>
  )
}

function getByNum(matches: Match[], num: number): Match | undefined {
  return matches.find(m => m.num === num)
}

export default function BracketView({ matches, onSave }: Props) {
  const [selected, setSelected] = useState<Match | null>(null)
  const { user } = useAuth()
  const resolved = resolveBracket(matches)

  const m = (num: number) => getByNum(resolved, num)

  const card = (num: number) => {
    const match = m(num)
    if (!match) return <div className="w-[150px] h-12 bg-slate-900 rounded border border-slate-800 opacity-40" />
    return (
      <BracketMatch
        match={match}
        onClick={() => setSelected(match)}
        editable={!!user}
      />
    )
  }

  // R32 order: each consecutive pair feeds the same R16 match
  // [74,77]→M89, [73,75]→M90, [83,84]→M93, [81,82]→M94
  // [76,78]→M91, [79,80]→M92, [86,88]→M95, [85,87]→M96
  const r32 = [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87]

  // R16 order aligned with R32 groups above
  // [89,90]→M97, [93,94]→M98, [91,92]→M99, [95,96]→M100
  const r16 = [89, 90, 93, 94, 91, 92, 95, 96]

  // QF: [97,98]→M101, [99,100]→M102
  const qf = [97, 98, 99, 100]

  // SF: [101,102]→M104
  const sf = [101, 102]

  return (
    <>
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 p-6 items-start min-w-max">
          {/* R32 — 16 slots */}
          <Column title="Ronda de 32">
            {r32.map(num => (
              <div key={num}>{card(num)}</div>
            ))}
          </Column>

          {/* R16 — 8 slots, each centered over 2 R32 matches */}
          <Column title="Ronda de 16">
            {r16.map(num => (
              <div key={num}>{card(num)}</div>
            ))}
          </Column>

          {/* QF — 4 slots */}
          <Column title="Cuartos">
            {qf.map(num => (
              <div key={num}>{card(num)}</div>
            ))}
          </Column>

          {/* SF — 2 slots */}
          <Column title="Semifinal">
            {sf.map(num => (
              <div key={num}>{card(num)}</div>
            ))}
          </Column>

          {/* Final + 3rd place */}
          <div className="flex flex-col shrink-0" style={{ height: TOTAL_HEIGHT }}>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-center">Final</p>
            <div className="flex flex-col flex-1" style={{ justifyContent: 'center', gap: `${SLOT_HEIGHT * 2}px` }}>
              <div>{card(104)}</div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 text-center">3° Lugar</p>
                {card(103)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <ScoreModal
          match={selected}
          editable={!!user}
          onSave={u => onSave(selected.id, u)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
