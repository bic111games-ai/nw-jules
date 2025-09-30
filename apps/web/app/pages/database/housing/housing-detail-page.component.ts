import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { getItemIconPath } from '@nw-data/common'
import { Housingitems } from '@nw-data/generated'
import { TranslateService } from '~/i18n'
import { NwModule } from '~/nw'
import { IconsModule } from '~/ui/icons'
import { svgSquareArrowUpRight } from '~/ui/icons/svg'
import { LayoutModule } from '~/ui/layout'
import { HtmlHeadService, injectRouteParam } from '~/utils'
import { ItemDetailModule } from '~/widgets/data/item-detail'
import { StatusEffectDetailModule } from '~/widgets/data/status-effect-detail'
import { LootModule } from '~/widgets/loot'
import { ScreenshotModule } from '~/widgets/screenshot'
import { ModelViewerModule } from '../../../widgets/model-viewer'
import { HousingTabsComponent } from './housing-detail-tabs.component'

@Component({
  standalone: true,
  selector: 'nwb-housing-detail-page',
  templateUrl: './housing-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    NwModule,
    ItemDetailModule,
    StatusEffectDetailModule,
    ScreenshotModule,
    LayoutModule,
    HousingTabsComponent,
    IconsModule,
    LootModule,
    ModelViewerModule,
  ],
  host: {
    class: 'block',
  },
})
export class HousingDetailPageComponent {
  protected itemId = toSignal(injectRouteParam('id'))
  protected iconLink = svgSquareArrowUpRight
  protected viewerActive = false
  public constructor(
    private route: ActivatedRoute,
    private i18n: TranslateService,
    private head: HtmlHeadService,
  ) {
    //
  }

  protected onEntity(entity: Housingitems) {
    if (!entity) {
      return
    }
    this.head.updateMetadata({
      title: this.i18n.get(entity.Name),
      description: this.i18n.get(entity.Description),
      url: this.head.currentUrl,
      image: `${this.head.origin}/${getItemIconPath(entity)}`,
    })
  }
}
