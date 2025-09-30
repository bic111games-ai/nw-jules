import { OverlayModule } from '@angular/cdk/overlay'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { IonHeader } from '@ionic/angular/standalone'
import { firstValueFrom, map } from 'rxjs'
import { CharacterStore } from '~/data'
import { NwModule } from '~/nw'
import { NwTextContextService } from '~/nw/expression'
import { DataViewModule, DataViewService, provideDataView } from '~/ui/data/data-view'
import { DataGridModule } from '~/ui/data/table-grid'
import { VirtualGridModule } from '~/ui/data/virtual-grid'
import { IconsModule } from '~/ui/icons'
import { svgFunction, svgGrid, svgTableList } from '~/ui/icons/svg'
import { LayoutModule } from '~/ui/layout'
import { NavbarModule } from '~/ui/nav-toolbar'
import { QuicksearchModule, QuicksearchService } from '~/ui/quicksearch'
import { TooltipModule } from '~/ui/tooltip'
import { HtmlHeadService, eqCaseInsensitive, injectBreakpoint, injectRouteParam, injectUrlParams, observeRouteParam, selectSignal } from '~/utils'
import { PerkTableAdapter, PerkTableRecord } from '~/widgets/data/perk-table'
import { ScreenshotModule } from '~/widgets/screenshot'

@Component({
  standalone: true,
  selector: 'nwb-perks-page',
  templateUrl: './perks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    NavbarModule,
    NwModule,
    LayoutModule,
    OverlayModule,
    QuicksearchModule,
    RouterModule,
    ScreenshotModule,
    DataGridModule,
    IconsModule,
    TooltipModule,
    VirtualGridModule,
    DataViewModule,
  ],
  host: {
    class: 'ion-page'
  },
  providers: [
    provideDataView({
      adapter: PerkTableAdapter,
    }),
    QuicksearchService.provider({
      queryParam: 'search',
    }),
    NwTextContextService,
  ],
})
export class PerksPageComponent {
  protected title = 'Perks'
  protected defaultRoute = 'table'
  protected filterParam = 'filter'
  protected selectionParam = 'id'
  protected persistKey = 'perks-table'
  protected category = selectSignal(injectRouteParam('category'), (it) => {
    return eqCaseInsensitive(it, this.defaultRoute) ? null : it
  })

  protected isLargeContent = toSignal(injectBreakpoint('(min-width: 992px)'))
  protected isChildActive = toSignal(injectUrlParams('/:resource/:category/:id', (it) => !!it?.['id']))
  protected showSidebar = computed(() => this.isLargeContent() && this.isChildActive())
  protected showModal = computed(() => !this.isLargeContent() && this.isChildActive())

  protected isToolOpen = false
  protected iconList = svgTableList
  protected iconGrid = svgGrid
  protected iconFunc = svgFunction
  protected isFuncOpen = false

  public constructor(
    public search: QuicksearchService,
    public ctx: NwTextContextService,
    protected service: DataViewService<PerkTableRecord>,
    head: HtmlHeadService,
    char: CharacterStore
  ) {
    service.patchState({ mode: 'table', modes: ['table'] })
    head.updateMetadata({
      url: head.currentUrl,
      title: 'New World - Perks DB',
    })
    firstValueFrom(char.level$).then((value) => {
      ctx.patchState({ charLevel: value })
    })
  }
  protected toggleMode() {
    // this.virtualModeActive = !this.virtualModeActive
  }
}
