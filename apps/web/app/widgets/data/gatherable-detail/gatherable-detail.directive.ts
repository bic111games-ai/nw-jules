import { Directive, forwardRef, Input, Output } from '@angular/core'
import { NwDataService } from '~/data'
import { GatherableDetailStore } from './gatherable-detail.store'

@Directive({
  standalone: true,
  selector: '[nwbGatherableDetail]',
  exportAs: 'gatherableDetail',
  providers: [
    {
      provide: GatherableDetailStore,
      useExisting: forwardRef(() => GatherableDetailDirective),
    },
  ],
})
export class GatherableDetailDirective extends GatherableDetailStore {
  @Input()
  public set nwbGatherableDetail(value: string) {
    this.patchState({ recordId: value })
  }

  @Output()
  public nwbGatherableChange = this.gatherable$

}
