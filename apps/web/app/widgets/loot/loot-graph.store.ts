import { computed } from "@angular/core"
import { signalStore, withComputed, withState } from "@ngrx/signals"
import { LootContext } from "~/nw/loot"

export interface LootGraphState {
  tableIds: string[]
  tags: string[]
  tagValues: Record<string, string | number>
  dropChance: number
  highlight: string

  showLocked: boolean
  showChance: boolean
  showStats: boolean
  tagsEditable: boolean
}

export type LootGraphStore = typeof LootGraphStore
export const LootGraphStore = signalStore(
  withState<LootGraphState>({
    tableIds: null,
    tags: [],
    tagValues: {},
    dropChance: 1,
    highlight: null,
    showLocked: false,
    showChance: false,
    showStats: false,
    tagsEditable: false,
  }),
  withComputed(({ tags, tagValues }) => {
    return {
      context: computed(() => {
        return LootContext.create({
          tags: tags(),
          values: tagValues(),
        })
      })
    }
  })
)
