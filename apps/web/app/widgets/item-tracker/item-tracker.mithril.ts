import { ClosureComponent } from 'mithril'
import { distinctUntilChanged, ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs'
import { ItemMeta, ItemPreferencesService } from '~/preferences'
import m from 'mithril'

export interface ItemTrackerAtts {
  itemId: string
  meta: ItemPreferencesService
  mode: keyof ItemMeta
  disabled?: boolean
  class?: string
  classEmpty?: string
  emptyText?: string
  emptyTip?: string
  multiply?: number
  onchange?: () => void
  formatter?: Intl.NumberFormat
}

export const ItemTrackerCell: ClosureComponent<ItemTrackerAtts> = () => {
  const itemId$ = new ReplaySubject<string>(1)
  const destroy$ = new Subject()

  let trackedId: string
  let trackedValue: number
  let showInput: boolean

  let multiply = 1
  let emptyText = '✏️'
  let emptyTip = 'Edit'

  return {
    onupdate: ({ attrs }) => {
      itemId$.next(attrs.itemId)
    },
    oncreate: ({ attrs }) => {
      itemId$
        .pipe(distinctUntilChanged())
        .pipe(switchMap((id) => attrs.meta.observe(id)))
        .pipe(takeUntil(destroy$))
        .subscribe((data) => {
          trackedId = data.id
          trackedValue = cleanValue(data.meta?.[attrs.mode])
          m.redraw()
        })
    },
    onremove: () => {
      destroy$.next(null)
      destroy$.complete()
    },
    view: ({ attrs }) => {
      const isEmpty = !(trackedValue > 0)
      const tip = attrs.emptyTip ?? emptyTip
      const result = attrs.formatter ? attrs.formatter.format(trackedValue * multiply) : trackedValue * multiply

      if (!showInput) {
        return m(
          'div.w-full.transition-opacity.hover:opacity-100',
          {
            class: [
              attrs.class,
              isEmpty && !!tip ? 'tooltip' : '',
              isEmpty && attrs.classEmpty ? attrs.classEmpty : '',
              isEmpty && 'opacity-25',
              attrs.disabled ? '' : 'cursor-pointer',
            ].join(' '),

            ['data-tip']: tip,
            onclick: () => {
              showInput = !attrs.disabled && !showInput
            },
          },
          isEmpty ? (attrs.disabled ? '' : emptyText) : result
        )
      }
      return m('input.input.input-ghost.input-xs.rounded-none.px-0.w-full', {
        type: 'number',
        min: 0,
        oncreate: (e) => {
          const input = e.dom as HTMLInputElement
          input.valueAsNumber = trackedValue
          input.select()
        },
        onchange: (e: InputEvent) => {
          attrs.meta.merge(trackedId, {
            [attrs.mode]: cleanValue((e.target as HTMLInputElement).value),
          })
          attrs.onchange?.()
        },
        onblur: () => {
          showInput = false
        },
        onkeydown: (e: KeyboardEvent) => {
          if (e.key === 'Escape' || e.key === 'Enter') {
            showInput = false
          }
        },
      })
    },
  }
}

function cleanValue(value: string | number | boolean) {
  if (typeof value !== 'number') {
    value = Number(value)
  }
  if (Number.isFinite(value)) {
    return value
  }
  return null
}
