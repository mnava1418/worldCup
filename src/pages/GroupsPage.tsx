import { useMatches } from '../hooks/useMatches'
import { getAllGroups } from '../lib/standings'
import GroupCard from '../components/groups/GroupCard'

export default function GroupsPage() {
  const { matches, loading, saveScore } = useMatches()

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-6 h-6 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
      </div>
    )
  }

  const groups = getAllGroups()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-white font-semibold text-lg mb-6">Fase de Grupos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <GroupCard
            key={group}
            group={group}
            matches={matches}
            onSave={saveScore}
          />
        ))}
      </div>
    </div>
  )
}
