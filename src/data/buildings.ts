import { processes, processIds } from './processes'
import type { BuildingDefinition, BuildingId } from '../engine/types'
export const buildingDefinitions = Object.fromEntries(processIds.map(id=>[id,{...processes[id],cost:Object.entries(processes[id].buildCost).map(([resource,amount])=>({resource,amount})),recipeIds:processes[id].recipeId?[processes[id].recipeId]:[]}])) as Record<BuildingId, BuildingDefinition>
export const buildableIds = processIds.filter(id=>id!=='townCenter')
