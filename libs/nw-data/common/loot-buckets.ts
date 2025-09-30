import { Lootbuckets } from '@nw-data/generated'
import { CaseInsensitiveMap } from './utils/caseinsensitive-map'
import { flatten } from 'lodash'
import { ParsedLootTag, parseLootTag } from './loot'

export function convertLootbuckets(data: Lootbuckets[]): LootBucketRow[] {
  const firstRow = data.find((it) => it.RowPlaceholders === 'FIRSTROW')
  const result = data.map((row, i) => convertRow(row, firstRow, i))
  return flatten(result).filter((it) => !!it.Item)
}

export type LootBucketRow = {
  Row: number
  Column: number
  Item: string
  LootBucket: string
  MatchOne: boolean
  Quantity: number[]
  Tags: Map<string, ParsedLootTag>
}

function convertRow(data: Lootbuckets, firstRow: Lootbuckets, rowId: number): LootBucketRow[] {
  const keys = new Set<string>()
  const ids = new Set<number>()
  for (const key of Object.keys(data)) {
    const match = key.match(/([^0-9]+)(\d+)$/)
    if (match) {
      keys.add(match[1])
      ids.add(Number(match[2]))
    }
  }

  return Array.from(ids)
    .sort()
    .map((id): LootBucketRow => {
      const bucketNameKey = `LootBucket${id}`
      return {
        Column: id,
        Row: rowId,
        Item: null as string,
        LootBucket: firstRow[bucketNameKey] || '',
        MatchOne: null,
        Quantity: null as number[],
        Tags: new CaseInsensitiveMap(),
      }
    })
    .map((result) => {
      for (const key of keys) {
        const value = data[`${key}${result.Column}`]
        switch (key) {
          case 'Tags': {
            const tags = ((value as string[]) || []).map(parseLootTag)
            for (const tag of tags) {
              if (tag) {
                result.Tags.set(tag.name, tag)
              }
            }
            break
          }
          case 'Quantity': {
            result[key] = typeof value === 'string' ? value.split('-').map(Number) : [value]
            break
          }
          case 'MatchOne': {
            result[key] = String(value).toLowerCase() === 'true'
            break
          }
          default: {
            if (key === 'LootBucket') {
              if (value && (value !== result[key])) {
                //console.log('LootBucket', result.Column, value, result[key], result.Item)
                result[key] = value
              }
            } else {
              result[key] = value
            }
            break
          }
        }
      }
      return result
    })
}
