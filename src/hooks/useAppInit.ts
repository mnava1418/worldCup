import { useEffect } from 'react'
import { loadFixtureIfNeeded } from '../lib/fixtureLoader'

export function useAppInit() {
  useEffect(() => {
    loadFixtureIfNeeded().catch(err => {
      console.error('Failed to initialize fixture:', err)
    })
  }, [])
}
