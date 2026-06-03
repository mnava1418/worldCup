import { useMatches } from '../hooks/useMatches'
import BracketView from '../components/bracket/BracketView'

export default function BracketPage() {
  const { matches, loading, saveScore } = useMatches()

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-white font-semibold text-lg mb-6">Bracket Eliminatorio</h1>
      </div>
      <BracketView matches={matches} onSave={saveScore} />
    </div>
  )
}
