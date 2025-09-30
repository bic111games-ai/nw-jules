import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NwTradeskillService } from '~/nw/tradeskill'
import { HtmlHeadService } from '~/utils'
import { TradeskillsModule } from '~/widgets/tradeskills'

@Component({
  standalone: true,
  selector: 'nwb-tradeskills-page',
  templateUrl: './tradeskills.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, TradeskillsModule],
  host: {
    class: 'layout-col layout-pad',
  },
})
export class TradeskillsComponent {
  public skills = this.service.skills

  public categories = this.service.categories

  public selected: string

  public constructor(private service: NwTradeskillService, head: HtmlHeadService) {
    head.updateMetadata({
      title: 'Trade Skills',
      description: 'Trade skill progression settings',
      noFollow: true,
      noIndex: true,
    })
  }

  public skillsByCategory(name: string) {
    return this.service.skillsByCategory(name)
  }

  public isActive(category: string, index: number) {
    if (!this.selected) {
      return index == 0
    }
    return this.selected === category
  }
}
