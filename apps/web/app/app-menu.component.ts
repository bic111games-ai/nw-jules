import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { DomSanitizer } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { IonSegment, IonSegmentButton, IonToolbar, SegmentCustomEvent } from '@ionic/angular/standalone'
import { patchState, signalState } from '@ngrx/signals'
import { map } from 'rxjs'
import { NW_BUDDY_LIVE, NW_BUDDY_PTR, environment } from '../environments'
import { APP_MENU } from './app-menu'
import { NwModule } from './nw'
import { IconsModule } from './ui/icons'
import { svgChevronLeft } from './ui/icons/svg'
import { LayoutModule } from './ui/layout'
import { MenuCloseDirective } from './ui/layout/menu.directive'
import { injectCurrentUrl } from './utils/injection/current-url'

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  imports: [
    CommonModule,
    NwModule,
    IconsModule,
    RouterModule,
    LayoutModule,
    IonToolbar,
    IonSegment,
    IonSegmentButton,
    MenuCloseDirective,
  ],
  host: {
    class: 'ion-page',
  },
})
export class AppMenuComponent {
  private sanitizer = inject(DomSanitizer)

  protected get showPtrSwitch() {
    return (this.isLive || this.isPTR) && !environment.standalone
  }

  protected get isLive() {
    return environment.workspace === 'live'
  }

  protected get isPTR() {
    return environment.workspace === 'ptr'
  }

  protected ptrUrl = toSignal(
    injectCurrentUrl().pipe(map((it) => this.sanitizer.bypassSecurityTrustUrl(NW_BUDDY_PTR + it))),
  )
  protected liveUrl = toSignal(
    injectCurrentUrl().pipe(map((it) => this.sanitizer.bypassSecurityTrustUrl(NW_BUDDY_LIVE + it))),
  )

  protected get version() {
    return environment.version?.split('#')?.[0]
  }

  private state = signalState({
    menu: APP_MENU,
    active: APP_MENU[0].category,
  })

  protected get menu() {
    return this.state.menu()
  }

  protected get active() {
    return this.state.active()
  }

  protected readonly chevronIcon = svgChevronLeft

  protected onGroupActive(category: string) {
    patchState(this.state, { active: category })
  }

  protected handleSegmentChange(event: SegmentCustomEvent) {
    patchState(this.state, { active: event.detail.value as any })
  }
}
