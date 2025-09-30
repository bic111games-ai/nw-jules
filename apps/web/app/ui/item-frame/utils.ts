import { ItemRarity } from '@nw-data/common'

export function getIconFrameClass({
  solid,
  rarity,
  isNamed,
  isArtifact,
}: {
  solid?: boolean
  rarity?: ItemRarity
  isNamed?: boolean
  isArtifact?: boolean
}) {
  const result: string[] = []
  if (rarity != null) {
    result.push(`nw-item-icon-frame`)
    result.push(solid ? 'nw-item-icon-bg' : 'nw-item-icon-mask')
    result.push(`nw-item-rarity-${rarity}`)
  }
  if (isNamed) {
    result.push('named')
  }
  if (isArtifact) {
    result.push('artifact')
  }
  return result
}
