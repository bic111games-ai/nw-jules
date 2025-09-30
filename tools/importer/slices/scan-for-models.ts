import { scanForData } from './scan-for-spawners-utils'
import { readDynamicSliceFile, resolveDynamicSliceFile } from './utils'

export interface VitalScanRow {
  vitalsID: string
  categoryID: string
  level: number
  territoryLevel?: boolean
  damageTable: string
  modelFile: string
  position?: number[]
  mapID?: string
}

export async function scanForVitals(inputDir: string, sliceFile: string): Promise<VitalScanRow[]> {
  sliceFile = await resolveDynamicSliceFile(inputDir, sliceFile)
  const result: VitalScanRow[] = []
  if (!sliceFile) {
    return result
  }

  const sliceComponent = await readDynamicSliceFile(sliceFile)
  if (!sliceComponent) {
    return result
  }

  const data = await scanForData(sliceComponent, inputDir, sliceFile)
  for (const item of data || []) {
    if (item.vitalsID) {
      result.push({
        level: item.level,
        vitalsID: item.vitalsID,
        categoryID: item.categoryID,
        damageTable: item.damageTable,
        modelFile: item.modelFile,
      })
    }
  }

  return result.filter((it) => !!it.vitalsID)
}
