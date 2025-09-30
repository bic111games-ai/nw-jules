import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, Type, computed, inject, signal } from '@angular/core'
import { NwModule } from '~/nw'
import { VitalDetailAttacksComponent } from './vital-detail-attacks.component'
import { VitalDetailBuffsComponent } from './vital-detail-buffs.component'
import { VitalDetailHeaderComponent } from './vital-detail-header.component'
import { VitalDetailModelsComponent } from './vital-detail-models.component'
import { VitalDetailStatsComponent } from './vital-detail-stats.component'
import { VitalDetailStore } from './vital-detail.store'

export interface VitalDetailTab {
  id: string
  label: string
  component: Type<any>
}

@Component({
  standalone: true,
  selector: 'nwb-vital-detail-card',
  templateUrl: './vital-detail-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NwModule,
    VitalDetailHeaderComponent,
    VitalDetailStatsComponent,
    VitalDetailAttacksComponent,
    VitalDetailModelsComponent,
    VitalDetailBuffsComponent,
  ],
  providers: [VitalDetailStore],
  host: {
    class: 'block rounded-md overflow-hidden border border-base-100',
    '[class.bg-base-200]': '!hasDarkBg()',
    '[class.bg-black]': 'hasDarkBg()'
  },
})
export class VitalDetailCardComponent {
  private store = inject(VitalDetailStore)

  @Input({ required: true })
  public set vitalId(value: string) {
    this.store.patchState({ vitalId: value })
  }

  @Input()
  public set level(value: number) {
    this.store.patchState({ level: value })
  }

  @Input()
  public set mutaElement(value: string) {
    this.store.patchState({ mutaElementId: value })
  }

  @Input()
  public set mutaDifficulty(value: number) {
    this.store.patchState({ mutaDifficulty: value })
  }

  @Input()
  public set activeTab(value: string) {
    this.currentTab.set(value)
  }

  protected currentTab = signal<string>(null)
  protected hasDarkBg = computed(() => this.currentTab() === 'models')
  protected tabs = computed(() => {
    const tab = this.currentTab()
    return [
      {
        id: 'stats',
        label: 'Stats',
        component: VitalDetailStatsComponent,
      },
      {
        id: 'attacks',
        label: 'Attacks',
        component: VitalDetailAttacksComponent,
      },
      {
        id: 'buffs',
        label: 'Buffs',
        component: VitalDetailBuffsComponent,
      },
      {
        id: 'models',
        label: '3D Model',
        component: VitalDetailModelsComponent,
      },
    ].map((it, i) => {
      return {
        ...it,
        active: (!tab && !i) || it.id === tab,
      }
    })
  })
}
