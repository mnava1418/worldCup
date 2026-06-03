import type { ReactNode } from 'react'
import type { Match } from '../../types'
import { resolveBracket } from '../../lib/bracketLogic'
import BracketMatch from './BracketMatch'
import ScoreModal from '../ScoreModal'
import { useState } from 'react'

interface Props {
  matches: Match[]
  onSave: (matchId: string, updates: Partial<Match>) => Promise<void>
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0 shrink-0">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 text-center">{title}</p>
      <div className="flex flex-col justify-around flex-1 gap-3">{children}</div>
    </div>
  )
}

function getByNum(matches: Match[], num: number): Match | undefined {
  return matches.find(m => m.num === num)
}

export default function BracketView({ matches, onSave }: Props) {
  const [selected, setSelected] = useState<Match | null>(null)
  const resolved = resolveBracket(matches)

  const m = (num: number) => getByNum(resolved, num)

  const card = (num: number) => {
    const match = m(num)
    if (!match) return <div className="w-[150px] h-12 bg-slate-900 rounded border border-slate-800 opacity-40" />
    return (
      <BracketMatch
        match={match}
        onClick={() => {
          const orig = matches.find(x => x.num === num)
          if (orig) setSelected(orig)
        }}
      />
    )
  }

  const r32pairs = [
    [73, 74], [75, 76], [77, 78], [79, 80],
    [81, 82], [83, 84], [85, 86], [87, 88],
  ]
  const r16pairs = [[89, 90], [91, 92], [93, 94], [95, 96]]
  const qfPairs = [[97, 99], [98, 100]]
  const sfPairs = [[101, 102]]

  return (
    <>
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-8 p-6 items-start min-w-max">
          {/* R32 */}
          <Column title="Ronda de 32">
            {r32pairs.map(([a, b]) => (
              <div key={a} className="flex flex-col gap-1.5">
                {card(a)}
                {card(b)}
              </div>
            ))}
          </Column>

          {/* R16 */}
          <Column title="Ronda de 16">
            {r16pairs.map(([a, b]) => (
              <div key={a} className="flex flex-col gap-1.5" style={{ marginTop: 'calc(50% - 30px)' }}>
                {card(a)}
                {card(b)}
              </div>
            ))}
          </Column>

          {/* QF */}
          <Column title="Cuartos">
            {qfPairs.map(([a, b]) => (
              <div key={a} className="flex flex-col gap-1.5">
                {card(a)}
                {card(b)}
              </div>
            ))}
          </Column>

          {/* SF */}
          <Column title="Semifinal">
            {sfPairs.map(([a, b]) => (
              <div key={a} className="flex flex-col gap-1.5">
                {card(a)}
                {card(b)}
              </div>
            ))}
          </Column>

          {/* Final + 3rd */}
          <div className="flex flex-col gap-6 shrink-0">
            <Column title="Final">
              <div className="flex flex-col gap-1.5">
                {card(104)}
              </div>
            </Column>
            <Column title="3° Lugar">
              <div className="flex flex-col gap-1.5">
                {card(103)}
              </div>
            </Column>
          </div>
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
