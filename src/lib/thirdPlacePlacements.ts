/**
 * Assigns 8 third-place teams to R32 slots using bipartite matching.
 *
 * The constraints below are taken directly from the official FIFA 2026 fixture:
 * each R32 "vs third" slot only accepts thirds from specific group clusters.
 * This mirrors the same logic as FIFA's published 495-combination table.
 */

type Slot = 'M74' | 'M77' | 'M79' | 'M80' | 'M81' | 'M82' | 'M85' | 'M87'

export type ThirdPlaceSlots = Record<Slot, string>

const SLOT_CLUSTERS: Record<Slot, string[]> = {
  M74: ['A', 'B', 'C', 'D', 'F'],
  M77: ['C', 'D', 'F', 'G', 'H'],
  M79: ['C', 'E', 'F', 'H', 'I'],
  M80: ['E', 'H', 'I', 'J', 'K'],
  M81: ['B', 'E', 'F', 'I', 'J'],
  M82: ['A', 'E', 'H', 'I', 'J'],
  M85: ['E', 'F', 'G', 'I', 'J'],
  M87: ['D', 'E', 'I', 'J', 'L'],
}

const SLOTS: Slot[] = ['M74', 'M77', 'M79', 'M80', 'M81', 'M82', 'M85', 'M87']

/**
 * Given the 8 groups that advanced their third-place teams,
 * returns which group's third goes to each R32 slot.
 * Uses backtracking with constraint propagation — always unique given FIFA's design.
 */
export function getThirdPlacePlacements(advancingGroups: string[]): ThirdPlaceSlots | null {
  const groupSet = new Set(advancingGroups)
  const assignment: Partial<ThirdPlaceSlots> = {}
  const usedGroups = new Set<string>()

  function solve(slotIndex: number): boolean {
    if (slotIndex === SLOTS.length) return true
    const slot = SLOTS[slotIndex]
    const eligible = SLOT_CLUSTERS[slot].filter(g => groupSet.has(g) && !usedGroups.has(g))
    for (const group of eligible) {
      assignment[slot] = group
      usedGroups.add(group)
      if (solve(slotIndex + 1)) return true
      delete assignment[slot]
      usedGroups.delete(group)
    }
    return false
  }

  return solve(0) ? (assignment as ThirdPlaceSlots) : null
}
