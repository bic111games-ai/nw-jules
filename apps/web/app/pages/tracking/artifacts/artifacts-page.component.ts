import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router'
import { map, merge, switchMap } from 'rxjs'
import { ItemPreferencesService } from '~/preferences'
import { DataViewModule, DataViewService, provideDataView } from '~/ui/data/data-view'
import { VirtualGridModule } from '~/ui/data/virtual-grid'
import { QuicksearchModule, QuicksearchService } from '~/ui/quicksearch'
import { HtmlHeadService, observeRouteParam } from '~/utils'
import { combineLatestOrEmpty } from '~/utils/rx/combine-latest-or-empty'
import { ArtifactRecord, ArtifactsTableAdapter } from './adapter'

@Component({
  standalone: true,
  selector: 'nwb-artifacts-page',
  templateUrl: './artifacts-page.component.html',
  imports: [CommonModule, RouterModule, DataViewModule, VirtualGridModule],
  providers: [
    provideDataView({
      adapter: ArtifactsTableAdapter,
    }),
    QuicksearchModule,
  ],
  host: {
    class: 'ion-page',
  },
})
export class ArtifactsPageComponent implements OnInit {
  @ViewChild(RouterOutlet, { static: true })
  protected outlet: RouterOutlet

  protected stats$ = this.service.categoryItems$
    .pipe(switchMap((list) => combineLatestOrEmpty(list?.map((it) => this.itemPref.observe(it.ItemID)))))
    .pipe(
      map((list) => {
        const total = list?.length
        const learned = list?.filter((it) => !!it.meta?.mark)?.length
        return {
          total: total,
          learned: learned,
          percent: learned / total,
        }
      })
    )

  public constructor(
    protected service: DataViewService<ArtifactRecord>,
    protected search: QuicksearchService,
    protected itemPref: ItemPreferencesService,
    route: ActivatedRoute,
    router: Router,
    head: HtmlHeadService
  ) {
    head.updateMetadata({
      url: head.currentUrl,
      title: 'New World - Artifacts Tracker',
    })
  }

  public ngOnInit() {
    this.service.loadCateory(
      merge(
        this.outlet.deactivateEvents.pipe(map(() => null)),
        this.outlet.activateEvents.pipe(switchMap(() => observeRouteParam(this.outlet.activatedRoute, 'category')))
      )
    )
  }
}
