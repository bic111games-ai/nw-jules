import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TerritoryModule } from '~/widgets/territory'

@Component({
  standalone: true,
  selector: 'nwb-territories-standing',
  templateUrl: './territories-standing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TerritoryModule],
  providers: [],
  host: {
    class: 'layout-content layout-pad',
  },
})
export class TerritoriesStandingComponent {
  //
}
