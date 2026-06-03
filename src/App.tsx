import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppInit } from './hooks/useAppInit'
import { TimezoneProvider } from './context/TimezoneContext'
import { AuthProvider } from './context/AuthContext'
import Nav from './components/Nav'
import GroupsPage from './pages/GroupsPage'
import FixturePage from './pages/FixturePage'
import BracketPage from './pages/BracketPage'

export default function App() {
  useAppInit()

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
