import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { getQuestTypeIcon } from '@nw-data/common'
import { Objectivetasks, PoiDefinition } from '@nw-data/generated'
import { combineLatest, defer, map, of, switchMap } from 'rxjs'
import { NwDataService } from '~/data'
import { TranslateService } from '~/i18n'
import { NwLinkService, NwModule } from '~/nw'
import { NwExpressionContext } from '~/nw/expression'
import { IconsModule } from '~/ui/icons'
import { svgEllipsisVertical } from '~/ui/icons/svg'
import { ItemFrameModule } from '~/ui/item-frame'
import { selectStream } from '~/utils'
import { ItemDetailStore } from './item-detail.store'

export interface PerkTask {
  icon: string
  description: string
  context: NwExpressionContext
}

@Component({
  standalone: true,
  selector: 'nwb-item-detail-perk-tasks',
  templateUrl: './item-detail-perk-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NwModule, ItemFrameModule, IconsModule],
  host: {
    class: 'flex flex-col gap-1',
  },
})
export class ItemDetailPerkTasksComponent {
  private db = inject(NwDataService)
  private tl8 = inject(TranslateService)
  private nwdb = inject(NwLinkService)

  protected tasks$ = selectStream(this.store.artifactPerkTasks$).pipe(
    map((tasks) => {
      if (!tasks) {
        return null
      }
      const list = [tasks.task, tasks.perk1, tasks.perk2, tasks.perk3, tasks.perk4].filter((it) => !!it)
      if (!list.length) {
        return null
      }
      return list.map((task) => this.selectTask(task))
    }),
  )

  protected trackByIndex = (i: number) => i
  protected iconObjective = svgEllipsisVertical

  public constructor(private store: ItemDetailStore) {
    //
  }

  protected textContext(task: Objectivetasks) {
    return {
      targetName: task.TargetQty,
      POITags: task.POITag,
    }
  }

  private selectTask(task: Objectivetasks): PerkTask {
    return {
      icon: task.Type === 'SimpleTaskContainer' ? null : getQuestTypeIcon(task.Type),
      description: task.TP_DescriptionTag,
      context: {
        charLevel: null,
        gearScore: null,
        targetName: defer(() => this.resolveTargetName(task)),
        POITags: defer(() => this.resolvePOITags(task)),
        territoryID: defer(() => this.resolveTerritoryID(task)),
        targetAmount: task.TargetQty,
      },
    }
  }

  private resolveTargetName(task: Objectivetasks) {
    return combineLatest({
      category: this.db.vitalsCategory(task.KillEnemyType),
      vital: this.db.vital(task.KillEnemyType),
    }).pipe(
      switchMap(({ category, vital }) => {
        if (!category) {
          return of(task.KillEnemyType)
        }
        return this.tl8.observe(category.DisplayName).pipe(
          map((it) => {
            if (vital) {
              const link = this.nwdb.link('vitals', String(vital.VitalsID))
              return `<a href="${link}" target="_blank" class="link">${it}</a>`
            }
            return it
          }),
        )
      }),
      map((text) => {
        return task.TargetQty > 1 ? `${task.TargetQty} ${text} ` : text
      }),
    )
  }

  private resolvePOITags(task: Objectivetasks) {
    return combineLatest({
      poiByTag: this.db.poiByPoiTag,
      areaByTag: this.db.areaByPoiTag,
    })
      .pipe(map(({ poiByTag, areaByTag }) => poiByTag.get(task.POITag) || areaByTag.get(task.POITag)))
      .pipe(map((it): PoiDefinition => (it?.[0] || null) as PoiDefinition))
      .pipe(
        switchMap((poi) => {
          if (!poi) {
            return of(task.POITag)
          }
          return this.tl8.observe(poi.NameLocalizationKey).pipe(
            map((it) => {
              const link = this.nwdb.link('poi', String(poi.TerritoryID))
              return `<a href="${link}" target="_blank" class="link">${it}</a>`
            }),
          )
        }),
      )
  }

  private resolveTerritoryID(task: Objectivetasks) {
    return this.db.territoriesMap.pipe(map((it) => it.get(task.TerritoryID))).pipe(
      switchMap((it) => {
        if (!it) {
          return of(task.TerritoryID)
        }
        return this.tl8.observe(it.NameLocalizationKey).pipe(
          map((it) => {
            const link = this.nwdb.link('poi', String(task.TerritoryID))
            return `<a href="${link}" target="_blank" class="link">${it}</a>`
          }),
        )
      }),
    )
  }
}
