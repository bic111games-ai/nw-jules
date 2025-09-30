import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { WeaponTag } from '@nw-data/generated'
import { firstValueFrom, map } from 'rxjs'
import { NwModule } from '~/nw'
import { NwDataService } from '~/data'
import { ChartModule } from '~/ui/chart'
import { IconsModule } from '~/ui/icons'
import { svgChartLine } from '~/ui/icons/svg'
import { TooltipModule } from '~/ui/tooltip'
import { AttributesScalingStore } from './attributes-scale.store'

@Component({
  standalone: true,
  selector: 'nwb-attributes-scale',
  templateUrl: './attributes-scale.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NwModule, ChartModule, IconsModule, TooltipModule],
  providers: [AttributesScalingStore],
  host: {
    class: 'block relative',
  },
})
export class AttributesScaleComponent {
  @Input()
  public set weaponTag(value: string) {
    this.weaponRef = WEAPON_TAG_TO_REF[value as WeaponTag]
  }

  @Input()
  public set weaponRef(value: string) {
    this.store.patchState({ weaponId: value })
  }

  @Input()
  public set weaponItemId(value: string) {
    this.useWeaponItem(value)
  }

  @Input()
  public set affixId(value: string) {
    this.store.patchState({ affixId: value })
  }

  @Input()
  public set gearScore(value: number) {
    this.store.patchState({ gearScore: value })
  }

  @Input()
  public set attrDex(value: number) {
    this.store.patchState({
      stats: {
        ...this.store.state().stats,
        dex: value,
      },
    })
  }

  @Input()
  public set attrStr(value: number) {
    this.store.patchState({
      stats: {
        ...this.store.state().stats,
        str: value,
      },
    })
  }

  @Input()
  public set attrCon(value: number) {
    this.store.patchState({
      stats: {
        ...this.store.state().stats,
        con: value,
      },
    })
  }

  @Input()
  public set attrInt(value: number) {
    this.store.patchState({
      stats: {
        ...this.store.state().stats,
        int: value,
      },
    })
  }

  @Input()
  public set attrFoc(value: number) {
    this.store.patchState({
      stats: {
        ...this.store.state().stats,
        foc: value,
      },
    })
  }

  @Input()
  public set level(value: number) {
    this.store.patchState({
      playerLevel: value
    })
  }

  protected readonly config$ = this.store.chartConfig$
  protected readonly showTotal$ = this.store.showTotal$
  protected readonly modeIcon = svgChartLine
  public readonly damage$ = this.store.damageStats$.pipe(map((it) => it.value))
  public readonly damageInvalid$ = this.store.damageStats$.pipe(map((it) => it.invalidValue))

  public constructor(private store: AttributesScalingStore, private db: NwDataService) {
    //
  }

  private async useWeaponItem(itemId: string) {
    const item = await firstValueFrom(this.db.item(itemId))
    this.weaponRef = item?.ItemStatsRef
  }
  protected toggleMode() {
    this.store.patchState({
      showTotal: !this.store.state().showTotal,
    })
  }
}

const WEAPON_TAG_TO_REF: Record<WeaponTag, string> = {
  Sword: 'SwordT5',
  Flail: 'FlailT5',
  Rapier: 'RapierT5',
  Axe: 'HatchetT5',
  GreatAxe: '2HAxeT5',
  Greatsword: '2hGreatSwordT5',
  Warhammer: '2HhammerT5',
  Spear: 'SpearT5',
  Bow: 'BowT5',
  Rifle: 'MusketT5',
  Blunderbuss: 'BlunderbussT5',
  Fire: 'FireStaffT5',
  Heal: 'LifeStaffT5',
  Ice: '1hElementalGauntlet_IceT5',
  VoidGauntlet: 'VoidGauntletT5',
}
