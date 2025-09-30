import { GridOptions } from '@ag-grid-community/core'
import { Injectable, inject } from '@angular/core'
import { NW_FALLBACK_ICON, getQuestTypeIcon } from '@nw-data/common'
import { COLS_LOREITEMS } from '@nw-data/generated'
import { sortBy } from 'lodash'
import { map } from 'rxjs'
import { NwDataService } from '~/data'
import { DataViewAdapter } from '~/ui/data/data-view'
import {
  DataTableCategory,
  TABLE_GRID_ADAPTER_OPTIONS,
  TableGridAdapter,
  TableGridAdapterOptions,
  TableGridUtils,
  addGenericColumns,
} from '~/ui/data/table-grid'
import { VirtualGridOptions } from '~/ui/data/virtual-grid'
import { eqCaseInsensitive, humanize, mapFilter } from '~/utils'
import { LoreItemCellComponent } from './lore-item-cell.component'
import {
  LoreItemTableRecord,
  loreColBody,
  loreColID,
  loreColOrder,
  loreColTitle,
  loreColType,
} from './lore-item-table-cols'

@Injectable()
export class LoreItemTableAdapter
  implements DataViewAdapter<LoreItemTableRecord>, TableGridAdapter<LoreItemTableRecord>
{
  private db = inject(NwDataService)
  private config = inject<TableGridAdapterOptions<LoreItemTableRecord>>(TABLE_GRID_ADAPTER_OPTIONS, { optional: true })
  private utils: TableGridUtils<LoreItemTableRecord> = inject(TableGridUtils)

  public entityID(item: LoreItemTableRecord): string | number {
    return item.LoreID
  }

  public entityCategories(item: LoreItemTableRecord): DataTableCategory[] {
    if (!item.Type) {
      return null
    }
    return [
      {
        label: humanize(item.Type),
        id: item.Type,
        icon: getQuestTypeIcon(item.Type) || NW_FALLBACK_ICON,
      },
    ]
  }

  public virtualOptions(): VirtualGridOptions<LoreItemTableRecord> {
    return LoreItemCellComponent.buildGridOptions()
  }

  public gridOptions(): GridOptions<LoreItemTableRecord> {
    if (this.config?.gridOptions) {
      return this.config.gridOptions(this.utils)
    }
    return buildOptions(this.utils)
  }
  public connect() {
    return (this.config?.source || this.db.loreItems).pipe(
      map((list) => {
        return list.map((item): LoreItemTableRecord => {
          return {
            ...item,
            $numChildren: list.filter((i) => eqCaseInsensitive(i.ParentID, item.LoreID)).length,
          }
        })
      }),
      map((list) => {
        return sortBy(list, (item) => buildKey(list, item))
      })
    )
  }
}

function buildKey(list: LoreItemTableRecord[], item: LoreItemTableRecord) {
  if (!item.ParentID) {
    let order = item.Order
    let label = item.LoreID
    if (item.Type === 'Default') {
      order = 999
    }
    if (item.Type === 'Chapter') {
      order = 998
    }
    if (item.Type === 'Topic') {
      order = 1
      label = item.Title
      if (!!item.ImagePath) {
        order = 0
      }
      if (!item.$numChildren) {
        order = 99
      }
    }
    return `${String(order || 0).padStart(3, '0')}-${label}`
  }
  const parent = list.find((i) => eqCaseInsensitive(i.LoreID, item.ParentID))
  const parentKey = buildKey(list, parent)
  return `${parentKey}-${String(item.Order).padStart(3, '0')}-${item.LoreID}`
}

function buildOptions(util: TableGridUtils<LoreItemTableRecord>) {
  const result: GridOptions<LoreItemTableRecord> = {
    columnDefs: [loreColID(util), loreColTitle(util), loreColBody(util), loreColType(util), loreColOrder(util)],
  }
  addGenericColumns(result, {
    props: COLS_LOREITEMS,
  })
  return result
}
