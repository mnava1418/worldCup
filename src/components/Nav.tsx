import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTimezone } from '../context/TimezoneContext'
import { useAuth } from '../context/AuthContext'
import type { TZOption } from '../context/TimezoneContext'
import LoginModal from './LoginModal'

const links = [
  { to: '/grupos', label: 'Grupos' },
  { to: '/fixture', label: 'Fixture' },
  { to: '/bracket', label: 'Bracket' },
]

const TZ_OPTIONS: { value: TZOption; label: string }[] = [
  { value: 'America/Mexico_City', label: 'CT' },
  { value: 'America/New_York', label: 'ET' },
]

export default function Nav() {
  const { zone, setZone } = useTimezone()
  const { user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 h-14 flex items-center px-4 gap-4">
        <span className="text-white font-semibold text-sm tracking-wide shrink-0">Mundial 2026</span>

        <div className="flex gap-1 flex-1">
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

        {/* Timezone toggle */}
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 shrink-0">
          {TZ_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setZone(opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                zone === opt.value
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Auth */}
        {user ? (
          <button
            onClick={() => logout()}
            className="text-xs text-slate-400 hover:text-white transition-colors shrink-0"
            title={user.email ?? ''}
          >
            Salir
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            Editar
          </button>
        )}
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
