import { getFlagUrl } from '../lib/teamFlags'

interface Props {
  team: string
  className?: string
}

export default function Flag({ team, className = '' }: Props) {
  const url = getFlagUrl(team)
  if (!url) return null
  return (
    <img
      src={url}
      alt={team}
      loading="lazy"
      className={`inline-block rounded-sm object-cover shrink-0 ${className}`}
      style={{ width: 20, height: 14 }}
    />
  )
}
