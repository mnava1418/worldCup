import { NavLink } from 'react-router-dom'

const links = [
  { to: '/grupos', label: 'Grupos' },
  { to: '/fixture', label: 'Fixture' },
  { to: '/bracket', label: 'Bracket' },
]

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4">
      <span className="text-white font-semibold mr-8 text-sm tracking-wide">Mundial 2026</span>
      <div className="flex gap-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
