import { computed, effect } from '@angular/core'
import { signalStore, withComputed, withHooks, withState } from '@ngrx/signals'
import { withNwData } from '~/data/with-nw-data'
import { extractLimits, selectLimitsTable } from './utils'
import { withHashLocation } from '@angular/router'

export interface StatusEffectCategoryDetailState {
  categoryId: string
}

export const StatusEffectCategoryDetailStore = signalStore(
  withState<StatusEffectCategoryDetailState>({ categoryId: null }),
  withNwData((db) => {
    return {
      categoriesMap: db.statusEffectCategoriesMap,
      categories: db.statusEffectCategories
    }
  }),
  withComputed(({ categoryId, nwData }) => {
    const category = computed(() => nwData()?.categoriesMap?.get(categoryId()))
    const limits = computed(() => extractLimits(category()))
    const table = computed(() => selectLimitsTable(category(), nwData()?.categories || []))
    return {
      category: category,
      limits: limits,
      table: table,
      hasLimits: computed(() => !!table())
    }
  }),
  withHooks({
    onInit: (state) => {
      state.loadNwData()
    }
  })
)
