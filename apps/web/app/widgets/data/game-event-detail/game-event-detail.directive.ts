import { Directive, forwardRef, Input } from '@angular/core'
import { NwDataService } from '~/data'
import { GameEventDetailStore } from './game-event-detail.store'

@Directive({
  standalone: true,
  selector: '[nwbGameEventDetail]',
  exportAs: 'eventDetail',
  providers: [
    {
      provide: GameEventDetailStore,
      useExisting: forwardRef(() => GameEventDetailDirective),
    },
  ],
})
export class GameEventDetailDirective extends GameEventDetailStore {
  @Input()
  public set nwbGameEventDetail(value: string) {
    this.patchState({ eventId: value })
  }

  public constructor(db: NwDataService) {
    super(db)
  }
}
