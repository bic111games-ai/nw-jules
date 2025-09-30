import { Directive, Input } from '@angular/core'
import { territoryImage } from '@nw-data/common'
import { Territorydefinitions } from '@nw-data/generated'
import { defer } from 'lodash'
import { TerritoriesPreferencesService } from '~/preferences/territories-preferences.service'

@Directive({
  selector: '[nwbTerritory]',
  standalone: true,
})
export class TerritoryDirective {
  @Input()
  public nwbTerritory: Territorydefinitions

  public get image() {
    return territoryImage(this.nwbTerritory, 'territory')
  }

  public get imageSettlement() {
    return territoryImage(this.nwbTerritory, 'settlement')
  }

  public get imageFort() {
    return territoryImage(this.nwbTerritory, 'fort')
  }

  public data$ = defer(() => {})

  public constructor(private pref: TerritoriesPreferencesService) {}
}
