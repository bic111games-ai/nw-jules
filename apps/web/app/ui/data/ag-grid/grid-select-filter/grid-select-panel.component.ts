import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { patchState } from '@ngrx/signals'
import { IconsModule } from '~/ui/icons'
import { svgEquals, svgExclamation, svgNotEqual, svgRestartAlt, svgTrashCan } from '~/ui/icons/svg'
import { GridSelectFilterStore } from './grid-select-filter.store'
import { GridSelectOptionsComponent } from './grid-select-options.component'
import { GridSelectSearchComponent } from './grid-select-serach.component'
import { GridSelectFilterOption } from './types'

@Component({
  standalone: true,
  selector: 'nwb-grid-select-panel',
  template: `
    <div class="flex flex-col gap-[2px] px-2 pt-2">
      <div class="join flex flex-row">
        <button
          class="join-item btn btn-sm btn-square"
          [class.btn-primary]="hasActiveOptions && isNOT"
          [disabled]="!hasActiveOptions"
          (click)="enableNOT(!isNOT)"
        >
          <nwb-icon [icon]="iconNegate" class="w-4 h-4" />
        </button>
        <button
          class="join-item btn btn-sm flex-1"
          [class.btn-primary]="hasActiveOptions && !isAND"
          [disabled]="!hasActiveOptions"
          (click)="enableAND(false)"
        >
          OR
        </button>
        <button
          class="join-item btn btn-sm flex-1"
          [class.btn-primary]="hasActiveOptions && isAND"
          [disabled]="!hasActiveOptions"
          (click)="enableAND(true)"
        >
          AND
        </button>
        <button class="btn btn-sm btn-square" [disabled]="!hasActiveOptions" (click)="reset()">
          <nwb-icon [icon]="iconReset" class="w-4 h-4" />
        </button>
      </div>
      @for (item of conditions; track item.id) {
        <div class="join flex flex-row" @item>
          <button
            class="join-item btn btn-sm btn-square swap swap-rotate"
            [class.swap-active]="item.negate"
            (click)="toggleOptionNegation(item)"
          >
            <nwb-icon [icon]="iconEqual" class="swap-off w-4 h-4" />
            <nwb-icon [icon]="iconNotEqual" class="swap-on w-4 h-4" />
          </button>
          <span
            class="join-item flex flex-row flex-nowrap gap-1 items-center overflow-hidden text-nowrap input input-sm flex-1 bg-base-300"
          >
            @if (item.icon) {
              <img class="w-6 h-6" [src]="item.icon" />
            }
            {{ item.label }}
          </span>
          <button class="join-item btn btn-sm btn-square" (click)="removeOption(item)">
            <nwb-icon [icon]="iconTrash" class="w-4 h-4" />
          </button>
        </div>
      }
    </div>
    @if (searchEnabled) {
      <div class="px-2">
        <nwb-grid-select-search />
      </div>
    }
    <nwb-grid-select-options />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconsModule, GridSelectSearchComponent, GridSelectOptionsComponent],
  host: {
    class: 'flex flex-col gap-2',
  },
  animations: [
    trigger('item', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('100ms ease-in-out', style({ height: '*' })),
        animate('100ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: '*', height: '*' }),
        animate('100ms ease-in-out', style({ opacity: 0, height: 0 })),
      ]),
    ]),
  ],
})
export class GridSelectPanelComponent {
  private store = inject(GridSelectFilterStore)

  protected get model() {
    return this.store.model()
  }
  protected get hasActiveOptions() {
    return this.model?.children?.length > 0
  }
  protected get isAND() {
    return !!this.model?.and
  }
  protected get isNOT() {
    return !!this.model?.negate
  }
  protected get searchEnabled() {
    return this.store.searchEnabled()
  }
  protected get conditions() {
    return this.store.displayConditions()
  }

  protected iconReset = svgRestartAlt
  protected iconNegate = svgExclamation
  protected iconTrash = svgTrashCan
  protected iconEqual = svgEquals
  protected iconNotEqual = svgNotEqual

  public constructor() {
    //
  }

  protected enableAND(value: boolean) {
    patchState(this.store, ({ model }) => {
      return {
        model: {
          ...model,
          and: value,
        },
      }
    })
  }

  protected enableNOT(value: boolean) {
    patchState(this.store, ({ model }) => {
      return {
        model: {
          ...model,
          negate: value,
        },
      }
    })
  }

  protected reset() {
    patchState(this.store, ({ model }) => {
      return {
        model: {
          ...model,
          children: [],
        },
      }
    })
  }

  protected toggleOptionNegation(item: GridSelectFilterOption) {
    this.store.toggleOptionNegation(item)
  }

  protected removeOption(item: GridSelectFilterOption) {
    this.store.toggleSelection(item)
  }
}
