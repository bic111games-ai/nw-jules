import { Injectable } from '@angular/core'
import { PreferencesService } from './preferences.service'
import { StorageProperty } from './storage'

@Injectable({ providedIn: 'root' })
export class AppPreferencesService {

  public readonly projectName: StorageProperty<string>
  public readonly language: StorageProperty<string>
  public readonly theme: StorageProperty<string>
  public readonly tooltipProvider: StorageProperty<'nwdb'>
  public readonly collapseMenuMode: StorageProperty<'auto' | 'always'>
  public readonly nwmpServer: StorageProperty<string>
  public readonly mapActive: StorageProperty<boolean>
  public readonly mapCollapsed: StorageProperty<boolean>
  // public readonly web3token: StorageProperty<string>
  public readonly web3gateway: StorageProperty<string>
  public readonly appMenu: StorageProperty<Record<string, boolean>>

  public constructor(preferences: PreferencesService) {
    const storage = preferences.storage.storageObject('app')
    this.projectName = storage.storageProperty('projectName', 'nw-buddy')
    this.language = storage.storageProperty('language', 'en-us')
    this.theme = storage.storageProperty('theme', 'helloween')
    this.nwmpServer = storage.storageProperty('nwmpServer', null)
    this.tooltipProvider = storage.storageProperty('tooltipProvider', null)
    this.collapseMenuMode = storage.storageProperty('collapseMenuMode', null)
    // this.web3token = storage.storageProperty('web3token', null)
    // this.web3gateway = storage.storageProperty('web3gateway', null)
    this.appMenu = storage.storageProperty('menu', null)

    const session = preferences.session.storageObject('app')
    this.mapActive = session.storageProperty('mapActive', false)
    this.mapCollapsed = session.storageProperty('mapCollapsed', false)
  }
}
