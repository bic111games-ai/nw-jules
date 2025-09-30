import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { IonHeader } from '@ionic/angular/standalone'
import { NavbarModule } from '~/ui/nav-toolbar'
import { QuicksearchModule } from '~/ui/quicksearch'
import { ScreenshotModule } from '~/widgets/screenshot'

@Component({
  standalone: true,
  selector: 'nwb-info-cards-page',
  templateUrl: './info-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ScreenshotModule, NavbarModule, IonHeader, QuicksearchModule],
  host: {
    class: 'layout-col',
  },
})
export class InfoCardsComponent {}
