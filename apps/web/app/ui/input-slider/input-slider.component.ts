import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'
import { sumBy } from 'lodash'

interface Bar {
  flex: number
  value: number
}

@Component({
  standalone: true,
  selector: 'nwb-input-slider',
  template: `
    <input
      type="range"
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="value"
      (change)="change()"
      (input)="change()"
      [class.w-full]="true"
      [class.range]="true"
      [class.range-xs]="size === 'xs'"
      [class.range-sm]="size === 'sm'"
      [class.range-md]="size === 'md'"
      [class.range-lg]="size === 'lg'"
      [class.range-primary]="color === 'primary'"
      [class.range-secondary]="color === 'secondary'"
      [disabled]="disabled"
      #input
    />
    @if (bars || values) {
      <div class="w-full flex text-xs px-2">
        @for (bar of barNodes; track $index) {
          <span [style.flex]="bar.flex" class="w-[1px] flex flex-col gap-1">
            @if (bar.value != null && bars) {
              <span> | </span>
            }
            @if (values) {
              <span class="w-full flex justify-center">{{ bar.value }}</span>
            }
          </span>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  host: {
    class: 'block',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputSliderComponent,
    },
  ],
})
export class InputSliderComponent implements ControlValueAccessor, OnChanges {
  @Input()
  public min: number = 0

  @Input()
  public max: number = 100

  @Input()
  public step: number

  @Input()
  public bars: boolean

  @Input()
  public values: boolean

  @Input()
  public barsStep: number = 10

  @Input()
  public size: 'xs' | 'sm' | 'md' | 'lg' = 'md'

  @Input()
  public color: 'primary' | 'secondary'

  @ViewChild('input', { static: true, read: ElementRef })
  protected input: ElementRef<HTMLInputElement>

  protected barNodes: Bar[] = []
  protected trackByIndex = (i: number) => i

  public constructor() {
    //
  }
  protected onChange = (value: unknown) => {}
  protected onTouched = () => {}
  protected touched = false
  protected disabled = false
  protected value: number
  public writeValue(value: any): void {
    this.value = value
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  public ngOnChanges(): void {
    const min = this.min
    const max = this.max
    const step = this.barsStep
    const bars: Bar[] = []

    for (let i = min; i <= max; i++) {
      if (i === min || i === max || i % step === 0) {
        bars.push({ flex: 0, value: i })
      }
    }
    this.barNodes = bars
      .map((it, i, list) => {
        const next = list[i + 1] || list[list.length - 1]
        return [
          it,
          {
            flex: (next.value - it.value) / step,
            value: null,
          },
        ]
      })
      .flat()
  }

  protected change() {
    const newValue = this.input.nativeElement.valueAsNumber
    if (this.value !== newValue) {
      this.value = newValue
      this.onChange(newValue)
    }
  }
}
