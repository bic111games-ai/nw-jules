import { Component, ElementRef, EventEmitter, Output, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { getZoneInfo, getZoneName } from '@nw-data/common'
import {
  Areadefinitions,
  LvlSpanws,
  PoiDefinition,
  TerritoriesMetadata,
  Territorydefinitions,
  Vitals,
  VitalsMetadata,
} from '@nw-data/generated'
import { sortBy } from 'lodash'
import { NwDataService } from '~/data'
import { TranslateService } from '~/i18n'
import { NwModule } from '~/nw'
import { IconsModule } from '~/ui/icons'
import { svgCompress, svgExpand } from '~/ui/icons/svg'
import { TooltipModule } from '~/ui/tooltip'
import { selectSignal } from '~/utils'
import { LandMapComponent, Landmark, LandmarkPoint, LandmarkZone, MapViewBounds } from '~/widgets/land-map'
import { VitalDetailStore } from './vital-detail.store'

export interface VitalPointData {
  vitalId?: string
  level?: number
  territories: number[]
  point?: number[]
}

@Component({
  standalone: true,
  selector: 'nwb-vital-detail-map',
  templateUrl: './vital-detail-map.component.html',
  imports: [NwModule, LandMapComponent, TooltipModule, FormsModule, IconsModule],
  host: {
    class: 'block rounded-md overflow-clip relative',
  },
})
export class VitalDetailMapComponent {
  protected db = inject(NwDataService)
  protected store = inject(VitalDetailStore)
  protected tl8 = inject(TranslateService)

  @Output()
  public vitalClicked = new EventEmitter<VitalPointData>()

  protected data = selectSignal(
    {
      vital: this.store.vital$,
      meta: this.store.metadata$,
      poisMap: this.db.poisMap,
      areasMap: this.db.areasMap,
      territoriesMap: this.db.territoriesMap,
      territoriesMetadataMap: this.db.territoriesMetadataMap,
    },
    (data) => selectData(data, this.tl8),
  )

  protected mapIds = selectSignal(this.data, (it) => Object.keys(it || {}))
  protected fallbackMapId = selectSignal(this.mapIds, (it) => it?.[0])
  protected selectedMapId = signal<string>(null)
  protected mapId = selectSignal(
    {
      selected: this.selectedMapId,
      fallback: this.fallbackMapId,
      mapIds: this.mapIds,
    },
    ({ selected, fallback, mapIds }) => {
      let result = selected ?? fallback
      if (result && !mapIds.includes(result)) {
        result = fallback
      }
      return result
    },
  )

  public readonly landmarks = selectSignal(
    {
      mapId: this.mapId,
      data: this.data,
    },
    ({ mapId, data }) => {
      if (!data || !mapId || !data[mapId]) {
        return []
      }
      return data[mapId]
    },
  )
  public readonly bounds = selectSignal(
    {
      mapId: this.mapId,
      meta: this.store.metadata$,
    },
    ({ mapId, meta }) => {
      return selectBounds(meta)[mapId]
    },
  )

  public hasMap = selectSignal(this.mapIds, (it) => !!it?.length)

  protected iconExpand = svgExpand
  protected iconCompress = svgCompress
  protected elRef = inject(ElementRef<HTMLElement>)

  protected toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      this.elRef.nativeElement.requestFullscreen()
    }
  }

  protected onFeatureClicked(id: string) {
    const payload = this.landmarks().find((it) => it.id === id)?.payload
    if (payload?.vitalId) {
      this.vitalClicked.emit(payload)
    }
  }
}

function selectBounds(meta: VitalsMetadata) {
  const result: Record<string, MapViewBounds> = {}
  if (!meta) {
    return result
  }
  for (const mapId of meta?.mapIDs || []) {
    for (const spawn of meta.lvlSpanws[mapId as keyof LvlSpanws] || []) {
      if (!result[mapId]) {
        result[mapId] = {
          min: [...spawn.p],
          max: [...spawn.p],
        }
      }
      for (let i = 0; i < 2; i++) {
        result[mapId].min[i] = Math.min(result[mapId].min[i], spawn.p[i])
        result[mapId].max[i] = Math.max(result[mapId].max[i], spawn.p[i])
      }
    }
    if (result[mapId]) {
      result[mapId].min[0] -= 30
      result[mapId].min[1] -= 30
      result[mapId].max[0] += 30
      result[mapId].max[1] += 30
    }
  }
  return result
}

function selectData(
  {
    vital,
    meta,
    poisMap,
    areasMap,
    territoriesMap,
    territoriesMetadataMap,
  }: {
    vital: Vitals
    meta: VitalsMetadata
    poisMap: Map<number, PoiDefinition>
    areasMap: Map<number, Areadefinitions>
    territoriesMap: Map<number, Territorydefinitions>
    territoriesMetadataMap: Map<string, TerritoriesMetadata>
  },
  tl8: TranslateService,
) {
  const result: Record<string, Landmark<VitalPointData>[]> = {}
  if (!meta) {
    return result
  }

  const territories = sortBy(meta.territories, (id) => {
    if (territoriesMap.has(id)) {
      return 1
    }
    if (areasMap.has(id)) {
      return 10
    }
    if (poisMap.has(id)) {
      return 100
    }
    return 0
  })
  for (const territoryId of territories) {
    const metadata = territoriesMetadataMap.get(String(territoryId).padStart(2, '0'))
    const shape = metadata?.zones?.[0]?.shape
    if (!shape) {
      continue
    }

    const zone = poisMap.get(territoryId) || areasMap.get(territoryId) || territoriesMap.get(territoryId)
    const name = getZoneName(zone)
    const info = getZoneInfo(zone)
    const mapId = 'newworld_vitaeeterna'
    result[mapId] ??= []
    result[mapId].push({
      id: `territory:${territoryId}`,
      title: `
      <div style="text-align: left;">
        <strong>${tl8.get(name)}</strong><br>${info}
      </div>
      `,
      color: '#FFFFFF',
      outlineColor: '#590e0e',
      shape: shape,
      opacity: 0.075,
      payload: {
        territories: [territoryId],
      },
    } satisfies LandmarkZone<VitalPointData>)
  }

  let id = 0
  const name = tl8.get(vital?.DisplayName) || vital?.VitalsID || meta?.vitalsID
  for (const mapId of meta?.mapIDs || []) {
    for (const spawn of meta.lvlSpanws[mapId as keyof LvlSpanws] || []) {
      id++
      const levels = spawn.l.length ? spawn.l : vital?.Level ? [vital.Level] : []
      result[mapId] ??= []
      result[mapId].push({
        id: `spawn:${id}`,
        title: `
          <div style="text-align: left;">
            <strong>${name}</strong><br>
            Level ${levels.join(', ')}<br>
            x: ${spawn.p[0].toFixed(2)} y: ${spawn.p[1].toFixed(2)}
          </div>
        `,
        color: '#DC2626',
        outlineColor: '#590e0e',
        opacity: 1,
        point: spawn.p,
        radius: 10,
        payload: {
          vitalId: vital?.VitalsID,
          level: Math.max(...spawn.l, vital.Level),
          territories: spawn.t,
          point: spawn.p,
        },
      } satisfies LandmarkPoint<VitalPointData>)
    }
  }
  return result
}
