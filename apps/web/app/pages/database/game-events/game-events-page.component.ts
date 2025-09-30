import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { IonHeader } from '@ionic/angular/standalone'
import { NwModule } from '~/nw'
import { DataGridModule } from '~/ui/data/table-grid'
import { DataViewModule, DataViewService, provideDataView } from '~/ui/data/data-view'
import { IconsModule } from '~/ui/icons'
import { QuicksearchModule, QuicksearchService } from '~/ui/quicksearch'
import { TooltipModule } from '~/ui/tooltip'
import { VirtualGridModule } from '~/ui/data/virtual-grid'
import { HtmlHeadService, eqCaseInsensitive, injectBreakpoint, injectRouteParam, injectUrlParams, observeRouteParam, selectSignal, selectStream } from '~/utils'
import { ItemTableRecord } from '~/widgets/data/item-table'
import { LootTableAdapter } from '~/widgets/data/loot-table-grid'
import { ScreenshotModule } from '~/widgets/screenshot'
import { GameEventTableAdapter } from '~/widgets/data/game-event-table'
import { LayoutModule } from '~/ui/layout'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  standalone: true,
  selector: 'nwb-game-events-page',
  templateUrl: './game-events-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DataGridModule,
    DataViewModule,
    IonHeader,
    LayoutModule,
    NwModule,
    QuicksearchModule,
    RouterModule,
    ScreenshotModule,
    TooltipModule,
    VirtualGridModule,
    IconsModule,
  ],
  host: {
    class: 'ion-page'
  },
  providers: [
    provideDataView({
      adapter: GameEventTableAdapter,
    }),
    QuicksearchService.provider({
      queryParam: 'search',
    }),
  ],
})
export class GameEventsPageComponent {
  protected title = 'Game Events'
  protected defaultRoute = 'table'
  protected filterParam = 'filter'
  protected selectionParam = 'id'
  protected persistKey = 'game-events-table'
  protected category = selectSignal(injectRouteParam('category'), (it) => {
    return eqCaseInsensitive(it, this.defaultRoute) ? null : it
  })

  protected isLargeContent = toSignal(injectBreakpoint('(min-width: 992px)'))
  protected isChildActive = toSignal(injectUrlParams('/:resource/:category/:id', (it) => !!it?.['id']))
  protected showSidebar = computed(() => this.isLargeContent() && this.isChildActive())
  protected showModal = computed(() => !this.isLargeContent() && this.isChildActive())

  public constructor(
    protected service: DataViewService<ItemTableRecord>,
    protected search: QuicksearchService,
    head: HtmlHeadService
  ) {
    service.patchState({ mode: 'table', modes: ['table'] })
    head.updateMetadata({
      url: head.currentUrl,
      title: 'New World - Game Events DB',
    })
  }
}
