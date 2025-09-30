import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { getVitalFamilyInfo } from '@nw-data/common'
import { Vitals } from '@nw-data/generated'
import { map } from 'rxjs'
import { TranslateService } from '~/i18n'

import { toSignal } from '@angular/core/rxjs-interop'
import { NwDataService } from '~/data'
import { NwModule } from '~/nw'
import { IconsModule } from '~/ui/icons'
import { svgPen } from '~/ui/icons/svg'
import { LayoutModule } from '~/ui/layout'
import { TooltipModule } from '~/ui/tooltip'
import { HtmlHeadService, observeQueryParam, observeRouteParam, selectSignal } from '~/utils'
import { VitalDetailModule, VitalDetailStore } from '~/widgets/data/vital-detail'
import { VitalPointData } from '~/widgets/data/vital-detail/vital-detail-map.component'
import { LootModule } from '~/widgets/loot'
import { LootContextEditorComponent } from '~/widgets/loot/loot-context-editor.component'
import { ScreenshotModule } from '~/widgets/screenshot'
import { ModelViewerModule } from '../../../widgets/model-viewer'

export type DetailTabId = 'stats' | 'loot-items' | 'loot-table' | 'damage-table' | '3d-model' | 'map'

@Component({
  standalone: true,
  templateUrl: './vital-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    NwModule,
    VitalDetailModule,
    LootModule,
    LayoutModule,
    ScreenshotModule,
    ModelViewerModule,
    TooltipModule,
    IconsModule,
  ],
  providers: [VitalDetailStore],
  host: {
    class: 'block',
  },
})
export class VitalDetailComponent {
  protected store = inject(VitalDetailStore)

  protected vital = toSignal(this.store.vital$)
  protected vitalId = toSignal(this.store.vitalId$)
  protected vitalLevel = toSignal(this.store.level$)

  protected tabId$ = observeQueryParam(this.route, 'tab').pipe(map((it: DetailTabId): DetailTabId => it || 'stats'))
  protected tab = toSignal(this.tabId$)

  protected difficulty$ = observeQueryParam(this.route, 'difficulty').pipe(map((it) => Number(it) || null))
  protected difficulty = toSignal(this.store.mutaDifficultyId$)

  protected iconEdit = svgPen

  protected lootTableId = selectSignal(this.store.vital$, (it) => it?.LootTableId)

  @ViewChild(LootContextEditorComponent, { static: false })
  protected editor: LootContextEditorComponent

  private db = inject(NwDataService)
  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private i18n: TranslateService,
    private head: HtmlHeadService,
  ) {
    this.store.loadById(observeRouteParam(this.route, 'id'))
    this.store.loadMutaDifficulty(observeQueryParam(this.route, 'difficulty').pipe(map((it) => Number(it) || null)))
  }

  public selectTab(tab: DetailTabId) {
    this.router.navigate([], {
      queryParams: {
        tab: tab,
      },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    })
  }

  public selectDifficulty(value: number) {
    this.router.navigate([], {
      queryParams: {
        difficulty: this.difficulty() === value ? null : value,
      },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    })
  }

  protected async onEntity(entity: Vitals) {
    if (!entity) {
      return
    }
    const info = getVitalFamilyInfo(entity)
    this.head.updateMetadata({
      title: [this.i18n.get(entity.DisplayName), 'Creature'].join(' - '),
      description: [this.i18n.get(info?.Name), `Level: ${entity.Level}`].join(' - '),
      url: this.head.currentUrl,
      image: info?.Icon,
    })
  }

  protected onPointClicked(payload: VitalPointData) {
    if (!payload) {
      return
    }
    this.editor.territoryId = null
    this.editor.poiId = null
    for (const id of payload.territories) {
      if (id < 1000) {
        this.editor.territoryId = id
      } else if (id < 10000) {
        //
      } else {
        this.editor.poiId = id
      }
    }
    this.editor.vitalLevel = payload.level
    this.editor.contLevel = payload.level
    this.editor.poiLevel = payload.level
  }
}
