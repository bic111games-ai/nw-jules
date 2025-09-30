import { GridOptions } from '@ag-grid-community/core'
import { Injectable, inject } from '@angular/core'
import { COLS_LOOTLIMITS } from '@nw-data/generated'
import { combineLatest, map } from 'rxjs'
import { NwDataService } from '~/data'
import { TABLE_GRID_ADAPTER_OPTIONS, TableGridAdapter, TableGridUtils } from '~/ui/data/table-grid'
import { DataTableCategory } from '~/ui/data/table-grid'
import { addGenericColumns } from '~/ui/data/table-grid'
import {
  LootLimitTableRecord,
  lootLimitColCountLimit,
  lootLimitColIcon,
  lootLimitColLimitExpiresAfter,
  lootLimitColName,
  lootLimitColTimeBetweenDrops,
} from './loot-limit-table-cols'
import { DataViewAdapter } from '~/ui/data/data-view'
import { VirtualGridOptions } from '~/ui/data/virtual-grid'

@Injectable()
export class LootLimitTableAdapter
  implements DataViewAdapter<LootLimitTableRecord>, TableGridAdapter<LootLimitTableRecord>
{
  private db = inject(NwDataService)
  private config = inject(TABLE_GRID_ADAPTER_OPTIONS, { optional: true })
  private utils: TableGridUtils<LootLimitTableRecord> = inject(TableGridUtils)

  public entityID(item: LootLimitTableRecord): string {
    return item.LootLimitID
  }

  public entityCategories(item: LootLimitTableRecord): DataTableCategory[] {
    return null
  }
  public virtualOptions(): VirtualGridOptions<LootLimitTableRecord> {
    return null
  }
  public gridOptions(): GridOptions<LootLimitTableRecord> {
    if (this.config?.gridOptions) {
      return this.config.gridOptions(this.utils)
    }
    return buildOptions(this.utils)
  }

  public connect() {
    return combineLatest({
      items: this.db.itemsMap,
      housing: this.db.housingItemsMap,
      limits: this.db.lootLimits,
    }).pipe(
      map(({ items, housing, limits }) => {
        return limits.map((it): LootLimitTableRecord => {
          return {
            ...it,
            $item: items.get(it.LootLimitID) || housing.get(it.LootLimitID),
          }
        })
      })
    )
  }
}

function buildOptions(util: TableGridUtils<LootLimitTableRecord>) {
  const result: GridOptions<LootLimitTableRecord> = {
    columnDefs: [
      lootLimitColIcon(util),
      lootLimitColName(util),
      lootLimitColCountLimit(util),
      lootLimitColTimeBetweenDrops(util),
      lootLimitColLimitExpiresAfter(util),
    ],
  }
  addGenericColumns(result, {
    props: COLS_LOOTLIMITS,
  })
  return result
}
