import { DOCUMENT } from '@angular/common'
import { Injectable, NgZone, inject } from '@angular/core'
import { Router } from '@angular/router'

import type { ipcRenderer } from 'electron'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private ipcRenderer: typeof ipcRenderer
  private window = inject(DOCUMENT).defaultView

  public windowChange = new Subject()

  public constructor(private router: Router, private zone: NgZone) {
    if (this.isElectron) {
      this.ipcRenderer = this.window.require('electron').ipcRenderer
      this.ipcRenderer.addListener('window-change', () => {
        this.windowChange.next(null)
      })
      this.ipcRenderer.addListener('open-url', (e, url: string) => {
        this.onDeeplinkReceived(url)
      })
    }
  }

  get isElectron(): boolean {
    return !!(this.window && this.window.process && this.window.process.type)
  }

  public sendWindowClose() {
    this.ipcRenderer?.invoke('window-close')
  }
  public sendWindowMin() {
    this.ipcRenderer?.invoke('window-minimize')
  }
  public sendWindowMax() {
    this.ipcRenderer?.invoke('window-maximize')
  }
  public sendWindowRestore() {
    this.ipcRenderer?.invoke('window-unmaximize')
  }
  public isWindowMaximized(): Promise<boolean> {
    return this.ipcRenderer?.invoke('is-window-maximized')
  }

  protected onDeeplinkReceived(link: string) {
    this.zone.run(() => {
      if (!link.startsWith('nw-buddy://')) {
        return
      }
      this.router.navigateByUrl(link.replace('nw-buddy://', '/'))
    })
  }
}
