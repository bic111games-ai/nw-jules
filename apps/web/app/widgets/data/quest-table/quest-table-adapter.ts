import { GridOptions } from '@ag-grid-community/core'
import { Injectable, inject } from '@angular/core'
import { NW_FALLBACK_ICON, getQuestTypeIcon } from '@nw-data/common'
import { COLS_OBJECTIVE, Objective } from '@nw-data/generated'
import { NwDataService } from '~/data'
import { TABLE_GRID_ADAPTER_OPTIONS, TableGridAdapter, TableGridUtils } from '~/ui/data/table-grid'
import { DataTableCategory } from '~/ui/data/table-grid'
import { addGenericColumns } from '~/ui/data/table-grid'
import { DataViewAdapter } from '~/ui/data/data-view'
import { VirtualGridOptions } from '~/ui/data/virtual-grid'
import { humanize } from '~/utils'
import {
  QuestTableRecord,
  questColAchievementId,
  questColDescription,
  questColDestinationCompletionAvailablePrompt,
  questColDestinationCompletionAvailableResponse,
  questColDifficultyLevel,
  questColIcon,
  questColInProgressResponse,
  questColObjectiveID,
  questColObjectiveProposalResponse,
  questColPlayerPrompt,
  questColRequiredAchievementId,
  questColRequiredLevel,
  questColTitle,
} from './quest-table-cols'

@Injectable()
export class QuestTableAdapter implements DataViewAdapter<QuestTableRecord>, TableGridAdapter<QuestTableRecord> {
  private db = inject(NwDataService)
  private config = inject(TABLE_GRID_ADAPTER_OPTIONS, { optional: true })
  private utils: TableGridUtils<QuestTableRecord> = inject(TableGridUtils)

  public entityID(item: Objective): string | number {
    return item.ObjectiveID
  }

  public entityCategories(item: Objective): DataTableCategory[] {
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
  public virtualOptions(): VirtualGridOptions<Objective> {
    return null
  }
  public gridOptions(): GridOptions<QuestTableRecord> {
    if (this.config?.gridOptions) {
      return this.config.gridOptions(this.utils)
    }
    return buildOptions(this.utils)
  }
  public connect() {
    return this.config?.source || this.db.quests
  }
}

function buildOptions(util: TableGridUtils<QuestTableRecord>) {
  const result: GridOptions<QuestTableRecord> = {
    columnDefs: [
      questColIcon(util),
      questColObjectiveID(util),
      questColTitle(util),
      questColDescription(util),
      questColPlayerPrompt(util),
      questColObjectiveProposalResponse(util),
      questColInProgressResponse(util),
      questColDestinationCompletionAvailablePrompt(util),
      questColDestinationCompletionAvailableResponse(util),
      questColDifficultyLevel(util),
      questColRequiredLevel(util),
      questColAchievementId(util),
      questColRequiredAchievementId(util),
    ],
  }
  addGenericColumns(result, {
    props: COLS_OBJECTIVE,
  })
  return result
}
