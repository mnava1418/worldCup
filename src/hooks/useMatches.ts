import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Match } from '../types'

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'matches'), snap => {
      setMatches(snap.docs.map(d => d.data() as Match))
      setLoading(false)
    })
    return unsub
  }, [])

  async function saveScore(matchId: string, updates: Partial<Match>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(doc(db, 'matches', matchId), updates as any)
  }

  return { matches, loading, saveScore }
}
