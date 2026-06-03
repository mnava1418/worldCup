import type { Standing } from '../../types'

interface Props {
  standings: Standing[]
}

export default function StandingsTable({ standings }: Props) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-slate-500 border-b border-slate-800">
          <th className="text-left py-1.5 font-normal">Equipo</th>
          <th className="text-center py-1.5 font-normal w-7">PJ</th>
          <th className="text-center py-1.5 font-normal w-7">PG</th>
          <th className="text-center py-1.5 font-normal w-7">PE</th>
          <th className="text-center py-1.5 font-normal w-7">PP</th>
          <th className="text-center py-1.5 font-normal w-8">GD</th>
          <th className="text-center py-1.5 font-normal w-7">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, i) => (
          <tr
            key={s.team}
            className={`border-b border-slate-800/50 ${i < 2 ? 'text-white' : 'text-slate-400'}`}
          >
            <td className="py-1.5 flex items-center gap-2">
              {i < 2 && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              )}
              {i === 2 && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
              )}
              {i >= 3 && <span className="w-1.5 h-1.5 shrink-0" />}
              <span className="truncate">{s.team}</span>
            </td>
            <td className="text-center py-1.5">{s.pj}</td>
            <td className="text-center py-1.5">{s.pg}</td>
            <td className="text-center py-1.5">{s.pe}</td>
            <td className="text-center py-1.5">{s.pp}</td>
            <td className="text-center py-1.5">{s.gd > 0 ? `+${s.gd}` : s.gd}</td>
            <td className="text-center py-1.5 font-semibold">{s.pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
