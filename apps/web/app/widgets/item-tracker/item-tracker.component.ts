import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ReplaySubject, distinctUntilChanged, switchMap } from 'rxjs'
import { ItemMeta, ItemPreferencesService } from '~/preferences'

@Component({
  selector: 'nwb-gs-tracker,nwb-price-tracker,nwb-stock-tracker',
  exportAs: 'gsTracker',
  templateUrl: './item-tracker.component.html',
  styleUrls: ['./item-tracker.component.scss'],
  providers: [],
  host: {
    '[class.tooltip]': 'isEmpty && !!emptyTip',
    '[class.opacity-25]': 'isEmpty',
    '[class.hover:opacity-100]': 'isEmpty',
    '[class.transition-opacity]': 'isEmpty',
  },
})
export class ItemTracker implements OnInit, OnChanges, AfterViewChecked {
  @Input()
  public set itemId(value: string) {
    this.itemId$.next(value)
  }

  @Input()
  public multiply: number = 1

  @Input()
  public format: string

  @Input()
  public emptyText = '✏️'

  @Input()
  @HostBinding('attr.data-tip')
  public emptyTip = 'Edit'

  public get isEmpty() {
    return !(this.value > 0)
  }

  public get value() {
    return this.trackedValue
  }
  public set value(v: number) {
    this.submitValue(v)
  }

  @ViewChild('input', { read: ElementRef })
  public input: ElementRef<HTMLInputElement>

  public showInput: boolean

  private itemId$ = new ReplaySubject<string>(1)
  private trackedId: string
  private trackedValue: number
  private mode: keyof ItemMeta

  public constructor(
    private meta: ItemPreferencesService,
    private cdRef: ChangeDetectorRef,
    elRef: ElementRef<HTMLElement>
  ) {
    this.mode = elRef.nativeElement.tagName.toLowerCase().match(/nwb-(\w+)-tracker/)[1] as any
    this.itemId$
      .pipe(distinctUntilChanged())
      .pipe(switchMap((id) => this.meta.observe(id)))
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        this.trackedId = data.id
        this.trackedValue = this.cleanValue(data.meta?.[this.mode])
        this.cdRef.markForCheck()
      })
  }

  public ngOnInit(): void {}

  public ngOnChanges(): void {
    this.cdRef.markForCheck()
  }

  public ngAfterViewChecked(): void {
    if (this.showInput && this.input) {
      this.input.nativeElement.focus()
    }
    this.cdRef.markForCheck()
  }

  public closeInput(e: Event) {
    if (this.showInput) {
      e.stopImmediatePropagation()
      if (e instanceof KeyboardEvent && this.input) {
        this.input.nativeElement.blur()
      } else {
        this.showInput = false
        this.cdRef.markForCheck()
      }
    }
  }

  @HostListener('click', ['$event'])
  public openInput(e: Event) {
    if (!this.showInput) {
      e.stopImmediatePropagation()
      this.showInput = true
      this.cdRef.markForCheck()
      setTimeout(() => {
        this.input.nativeElement?.select()
      })
    }
  }

  public submitValue(value: number | string) {
    this.showInput = false
    this.meta.merge(this.trackedId, {
      [this.mode]: this.cleanValue(value),
    })
    this.cdRef.markForCheck()
  }

  private cleanValue(value: string | number | boolean) {
    if (typeof value !== 'number') {
      value = Number(value)
    }
    if (Number.isFinite(value)) {
      return value
    }
    return null
  }
}
