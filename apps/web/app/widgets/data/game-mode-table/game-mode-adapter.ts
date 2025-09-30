import { GridOptions } from '@ag-grid-community/core'
import { Injectable, inject } from '@angular/core'
import { COLS_GAMEMODES } from '@nw-data/generated'
import { Observable } from 'rxjs'
import { NwDataService } from '~/data'

import { NwTextContextService } from '~/nw/expression'
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
import { selectStream } from '~/utils'

import {
  GameModeRecord,
  gameModeColDescription,
  gameModeColIcon,
  gameModeColLootTags,
  gameModeColMutLootTags,
  gameModeColName,
} from './game-mode-cols'

@Injectable()
export class GameModeTableAdapter implements TableGridAdapter<GameModeRecord>, DataViewAdapter<GameModeRecord> {
  private db = inject(NwDataService)
  private ctx = inject(NwTextContextService)
  private utils: TableGridUtils<GameModeRecord> = inject(TableGridUtils)
  private config: TableGridAdapterOptions<GameModeRecord> = inject(TABLE_GRID_ADAPTER_OPTIONS, { optional: true })
  private source$: Observable<GameModeRecord[]> = selectStream(this.config?.source || this.db.gameModes, (modes) => {
    if (this.config?.filter) {
      modes = modes.filter(this.config.filter)
    }
    if (this.config?.sort) {
      modes = [...modes].sort(this.config.sort)
    }
    return modes
  })
  public entityID(item: GameModeRecord): string {
    return item.GameModeId
  }

  public entityCategories(item: GameModeRecord): DataTableCategory[] {
    return null
  }

  public gridOptions(): GridOptions<GameModeRecord> {
    if (this.config?.gridOptions) {
      return this.config.gridOptions(this.utils)
    }
    return buildGameModeTableOptions(this.utils, this.ctx)
  }

  public virtualOptions(): VirtualGridOptions<GameModeRecord> {
    return null // PerkGridCellComponent.buildGridOptions()
  }

  public connect() {
    return this.source$
  }
}

export function buildGameModeTableOptions(util: TableGridUtils<GameModeRecord>, ctx: NwTextContextService) {
  const result: GridOptions<GameModeRecord> = {
    columnDefs: [
      gameModeColIcon(util),
      gameModeColName(util),
      gameModeColDescription(util),
      gameModeColLootTags(util),
      gameModeColMutLootTags(util),
    ],
  }
  addGenericColumns(result, {
    props: COLS_GAMEMODES,
  })
  return result
}
