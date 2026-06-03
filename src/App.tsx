import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppInit } from './hooks/useAppInit'
import { TimezoneProvider } from './context/TimezoneContext'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import GroupsPage from './pages/GroupsPage'
import FixturePage from './pages/FixturePage'
import BracketPage from './pages/BracketPage'

export default function App() {
  const { loading, error } = useAppInit()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-400 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Cargando fixture…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-400 font-medium mb-2">Error de inicialización</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
    <TimezoneProvider>
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 pt-[98px] sm:pt-14">
          <Routes>
            <Route path="/" element={<Navigate to="/grupos" replace />} />
            <Route path="/grupos" element={<GroupsPage />} />
            <Route path="/fixture" element={<FixturePage />} />
            <Route path="/bracket" element={<BracketPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </TimezoneProvider>
    </AuthProvider>
  )
}
