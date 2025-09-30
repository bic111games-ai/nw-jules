import { ColDef, GridOptions } from '@ag-grid-community/core'
import { eqCaseInsensitive, humanize } from '~/utils'
import { GridSelectFilter } from '../../ag-grid/grid-select-filter'
import { colDefPrecision } from './col-defs'

export function addGenericColumns(
  target: GridOptions,
  opts: {
    props: Record<string, string>
    scope?: string
    defaults?: {
      hide: boolean
    }
  }
) {
  const fields = Object.entries(opts.props)
  const scope = opts.scope
  for (const [field, type] of fields) {
    const exists = target.columnDefs.find((col: ColDef) => eqCaseInsensitive(col.colId, field))
    if (exists) {
      continue
    }
    const colDef: ColDef = {
      colId: field,
      getQuickFilterText: () => '',
      headerValueGetter: () => humanize(field),
      valueGetter: ({ data }) => {
        if (scope) {
          return data[scope]?.[field]
        } else {
          return data[field]
        }
      },
      field: field,
      hide: opts?.defaults?.hide ?? true,
    }
    colDef.filter = GridSelectFilter
    colDef.filterParams = {
      search: true,
    }
    if (type.includes('number')) {
      Object.assign(colDef, colDefPrecision)
    }
    target.columnDefs.push(colDef)
  }
  return target
}
