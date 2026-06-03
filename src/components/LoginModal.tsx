import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Props {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      onClose()
    } catch {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-xs p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold">Iniciar sesión</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white text-slate-900 font-medium rounded-lg text-sm hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
