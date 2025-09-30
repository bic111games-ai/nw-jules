import { NumberFilter } from '@ag-grid-community/core'
import { GatherableVariation, NW_FALLBACK_ICON, getGatherableNodeSize, getItemExpansion } from '@nw-data/common'
import { Gatherables, GatherablesMetadata, VariationsMetadata } from '@nw-data/generated'
import { TableGridUtils } from '~/ui/data/table-grid'
import { getGatherableIcon } from '../gatherable-detail/utils'

export type GatherableTableUtils = TableGridUtils<GatherableTableRecord>
export type GatherableTableRecord = Gatherables & {
  $meta: GatherablesMetadata
  $variations: GatherableVariation[]
  $variationsMetas: VariationsMetadata[]
}

export function gatherableColIcon(util: GatherableTableUtils) {
  return util.colDef({
    colId: 'icon',
    headerValueGetter: () => 'Icon',
    getQuickFilterText: () => '',
    resizable: false,
    sortable: false,
    filter: false,
    pinned: true,
    width: 62,
    cellClass: ['overflow-visible'],
    cellRenderer: util.cellRenderer(({ data }) => {
      return util.elA(
        {
          attrs: {
            href: util.tipLink('gatherable', data.GatherableID),
            target: '_blank',
          },
        },
        util.elItemIcon({
          class: ['transition-all translate-x-0 hover:translate-x-1'],
          icon: getGatherableIcon(data) || NW_FALLBACK_ICON,
        }),
      )
    }),
  })
}

export function gatherableColName(util: GatherableTableUtils) {
  return util.colDef<string>({
    colId: 'displayName',
    headerValueGetter: () => 'Name',
    sortable: true,
    filter: true,
    width: 250,
    valueGetter: ({ data }) => {
      let name = util.i18n.get(data.DisplayName)
      const size = getGatherableNodeSize(data.GatherableID)
      if (size) {
        name = `${name} - ${size}`
      }
      return name
    },
    cellRenderer: util.cellRenderer(({ value }) => util.lineBreaksToHtml(value)),
    cellClass: ['multiline-cell', 'py-2'],
    autoHeight: true,
    getQuickFilterText: ({ value }) => value,
  })
}

export function gatherableColID(util: GatherableTableUtils) {
  return util.colDef<string>({
    colId: 'gatherableId',
    headerValueGetter: () => 'Gatherable ID',
    field: 'GatherableID',
    hide: true,
  })
}

export function gatherableColTradeSkill(util: GatherableTableUtils) {
  return util.colDef<string>({
    colId: 'tradeSkill',
    headerValueGetter: () => 'Trade Skill',
    width: 120,
    field: 'Tradeskill',
    ...util.selectFilter({
      order: 'asc',
    })
  })
}

export function gatherableColLootTable(util: GatherableTableUtils) {
  return util.colDef<string>({
    colId: 'finalLootTable',
    headerValueGetter: () => 'Loot Table',
    width: 120,
    field: 'FinalLootTable',
    ...util.selectFilter({
      order: 'asc',
      search: true,
    })
  })
}

export function gatherableColGatherTime(util: GatherableTableUtils) {
  return util.colDef<number>({
    colId: 'baseGatherTime',
    headerValueGetter: () => 'Gather Time',
    getQuickFilterText: () => '',
    width: 150,
    field: 'BaseGatherTime',
    valueFormatter: ({ value }) => secondsToDuration(value),
    filter: NumberFilter,
  })
}
export function gatherableColMinRespawnTime(util: GatherableTableUtils) {
  return util.colDef<number>({
    colId: 'minRespawnRate',
    headerValueGetter: () => 'Min Respawn Rate',
    getQuickFilterText: () => '',
    width: 150,
    field: 'MinRespawnRate',
    valueFormatter: ({ value }) => secondsToDuration(value),
    filter: NumberFilter,
  })
}

export function gatherableColMaxRespawnTime(util: GatherableTableUtils) {
  return util.colDef<number>({
    colId: 'maxRespawnRate',
    headerValueGetter: () => 'Max Respawn Rate',
    getQuickFilterText: () => '',
    width: 150,
    valueGetter: ({ data }) => data.MaxRespawnRate,
    valueFormatter: ({ value }) => secondsToDuration(value),
    filter: NumberFilter,
  })
}

export function gatherableColExpansion(util: GatherableTableUtils) {
  return util.colDef<string>({
    colId: 'expansionIdUnlock',
    headerValueGetter: () => 'Expansion',
    width: 190,
    valueGetter: ({ data }) => util.i18n.get(getItemExpansion(data?.ExpansionIdUnlock)?.label),
    cellRenderer: util.cellRenderer(({ data }) => {
      const expansion = getItemExpansion(data?.ExpansionIdUnlock)
      if (!expansion) {
        return null
      }
      //return `"${data.RequiredExpansion}"`
      return util.el('div.flex.flex-row.gap-1.items-center', {}, [
        util.elImg({
          class: ['w-6', 'h-6'],
          src: expansion.icon,
        }),
        util.el('span', { text: util.i18n.get(expansion.label) }),
      ])
    }),
    ...util.selectFilter({
      order: 'asc',
      search: true,
      getOptions: ({ data }) => {
        const it = getItemExpansion(data?.ExpansionIdUnlock)
        return it
          ? [
              {
                id: it.id,
                label: util.i18n.get(it.label),
                icon: it.icon,
              },
            ]
          : []
      },
    }),
  })
}

export function gatherableColVariationCount(util: GatherableTableUtils) {
  return util.colDef<number>({
    colId: 'variationCount',
    headerValueGetter: () => 'Num Variations',
    getQuickFilterText: () => '',
    width: 150,
    valueGetter: ({ data }) => data.$variations?.length ?? 0,
    filter: NumberFilter,
  })
}

export function gatherableColVariations(util: GatherableTableUtils) {
  return util.colDef<string[]>({
    colId: 'variations',
    headerValueGetter: () => 'Variations',
    getQuickFilterText: ({ data }) => {
      const result = []
      data.$variations?.forEach((it) => {
        result.push(it.VariantID)
      })
      return result.join(' ')
    },
    valueGetter: ({ data }) => {
      const result = []
      if (data.$variations) {
        for (const it of data.$variations) {
          result.push(it.VariantID)
        }
      }
      result.sort()
      return result
    },
    cellRenderer: util.tagsRenderer({ getClass: () => [`font-mono`] }),
    sortable: false,
    wrapText: true,
    autoHeight: true,
    hide: true,
    width: 800,
    ...util.selectFilter({
      order: 'asc',
      search: true,
    }),
  })
}

export function gatherableColSpawnCount(util: GatherableTableUtils) {
  return util.colDef<number>({
    colId: 'variationCount',
    headerValueGetter: () => 'Num Spawns',
    getQuickFilterText: () => '',
    width: 150,
    valueGetter: ({ data }) => {
      let sum = 0
      if (data.$meta?.spawns) {
        for (const key in data.$meta.spawns) {
          sum += data.$meta.spawns[key].length
        }
      }
      if (data.$variationsMetas) {
        for (const variation of data.$variationsMetas) {
          for (const entry of variation.variantPositions) {
            sum += entry.elementCount
          }
        }
      }
      return sum
    },
    filter: NumberFilter,
  })
}

function secondsToDuration(value: number) {
  const milliseconds = Math.floor(value * 1000) % 1000
  const seconds = Math.floor(value % 60)
  const minutes = Math.floor(value / 60) % 60
  const hours = Math.floor(value / 3600) % 24
  const days = Math.floor(value / 86400)
  const result = []
  if (milliseconds) {
    result.push(`${milliseconds}ms`)
  }
  if (seconds) {
    result.push(`${seconds}s`)
  }
  if (minutes) {
    result.push(`${minutes}m`)
  }
  if (hours) {
    result.push(`${hours}h`)
  }
  if (days) {
    result.push(`${days}d`)
  }
  return result.reverse().join(' ')
}
