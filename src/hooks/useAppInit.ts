import { useState, useEffect } from 'react'
import { loadFixtureIfNeeded } from '../lib/fixtureLoader'

export function useAppInit() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFixtureIfNeeded()
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Failed to initialize fixture:', err)
        setError('Error cargando el fixture. Verifica la conexión y las credenciales de Firebase.')
        setLoading(false)
      })
  }, [])

  return { loading, error }
}
