import { FIFA_THIRD_PLACE_TABLE } from './fifaThirdPlaceTable'

type Slot = 'M74' | 'M77' | 'M79' | 'M80' | 'M81' | 'M82' | 'M85' | 'M87'

export type ThirdPlaceSlots = Record<Slot, string>

/**
 * Given the 8 groups that advanced their third-place teams,
 * returns which group's third goes to each R32 slot using
 * the official FIFA 2026 pre-determined lookup table (all 495 combinations).
 */
export function getThirdPlacePlacements(advancingGroups: string[]): ThirdPlaceSlots | null {
  const key = [...advancingGroups].sort().join(',')
  const entry = FIFA_THIRD_PLACE_TABLE[key]
  return entry ? (entry as ThirdPlaceSlots) : null
}
