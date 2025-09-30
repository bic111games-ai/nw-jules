import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, computed, effect, inject, viewChild, viewChildren } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { IonSegment, IonSegmentButton } from '@ionic/angular/standalone'
import { EQUIP_SLOTS, EquipSlot } from '@nw-data/common'
import { GearsetStore } from '~/data'
import { IconsModule } from '~/ui/icons'
import { LayoutModule } from '~/ui/layout'
import { SwiperDirective } from '~/utils/directives/swiper.directive'
import { ScreenshotFrameDirective, ScreenshotModule } from '~/widgets/screenshot'
import { GearCellSlotComponent } from '../cells/gear-cell-slot.component'
import { GearsetPaneMainComponent } from '../cells/gearset-pane-main.component'
import { GearsetPaneSkillComponent } from '../cells/gearset-pane-skill.component'
import { GearsetPaneStatsComponent } from '../cells/gearset-pane-stats.component'
import { GearsetLoadoutItemComponent } from '../loadout'
import { GearsetPaneComponent } from './gearset-pane.component'
import { GearsetToolbarComponent } from './gearset-toolbar.component'

@Component({
  standalone: true,
  selector: 'nwb-gearset-grid',
  templateUrl: './gearset-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    CommonModule,
    FormsModule,
    GearCellSlotComponent,
    GearsetLoadoutItemComponent,
    GearsetPaneMainComponent,
    GearsetPaneSkillComponent,
    GearsetPaneStatsComponent,
    GearsetToolbarComponent,
    IonSegment,
    IonSegmentButton,
    IconsModule,
    LayoutModule,
    ScreenshotModule,
    SwiperDirective,
    GearsetPaneComponent,
  ],
  host: {
    class: 'block @container',
  },
  hostDirectives: [
    {
      directive: ScreenshotFrameDirective,
    },
  ],
  animations: [
    trigger('list', [
      transition('* => *', [
        query(':enter', stagger(25, animateChild()), {
          optional: true,
        }),
      ]),
    ]),
    trigger('fade', [transition('* => *', [style({ opacity: 0 }), animate('0.3s ease-out', style({ opacity: 1 }))])]),
  ],
})
export class GearsetGridComponent {
  private store = inject(GearsetStore)

  @Input()
  public disabled = false

  protected elMain = viewChild<string, ElementRef<HTMLElement>>('elMain', { read: ElementRef })
  protected elStats = viewChild<string, ElementRef<HTMLElement>>('elStats', { read: ElementRef })
  protected elSkill1 = viewChild<string, ElementRef<HTMLElement>>('elSkill1', { read: ElementRef })
  protected elSkill2 = viewChild<string, ElementRef<HTMLElement>>('elSkill2', { read: ElementRef })
  protected elGear = viewChildren<string, ElementRef<HTMLElement>>('elGear', { read: ElementRef })

  protected get gearset() {
    return this.store.gearset()
  }
  protected slots = computed(() => {
    return EQUIP_SLOTS.filter(
      (it) => it.itemType !== 'Consumable' && it.itemType !== 'Ammo' && it.itemType !== 'Trophies',
    )
  })

  constructor(screenshot: ScreenshotFrameDirective) {
    effect(() => {
      screenshot.nwbScreenshotFrame = this.gearset?.name
      screenshot.nwbScreenshotWidth = 1660
      screenshot.nwbScreenshotMode = 'detached'
    })
  }

  public scrollToMain() {
    this.elMain().nativeElement.scrollIntoView({ behavior: 'smooth' })
  }
  public scrollToStats() {
    this.elStats().nativeElement.scrollIntoView({ behavior: 'smooth' })
  }
  public scrollToSkill1() {
    this.elSkill1().nativeElement.scrollIntoView({ behavior: 'smooth' })
  }
  public scrollToSkill2() {
    this.elSkill2().nativeElement.scrollIntoView({ behavior: 'smooth' })
  }
  public scrollToGear() {
    this.elGear()[0].nativeElement.scrollIntoView({ behavior: 'smooth' })
  }
}
