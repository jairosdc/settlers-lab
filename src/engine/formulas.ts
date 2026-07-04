import { CONNECTED_EFFICIENCY, DISCONNECTED_EFFICIENCY, ROAD_BONUS_PER_TECH } from './constants'
import type { BuildingInstance, GameState } from './types'
export function logisticEfficiency(connected: boolean, roadTech: boolean) { return connected ? CONNECTED_EFFICIENCY + (roadTech ? ROAD_BONUS_PER_TECH : 0) : DISCONNECTED_EFFICIENCY }
export function recipeThroughput(building: BuildingInstance) { return building.workers > 0 ? building.workers * building.efficiency : building.efficiency }
export function defensePower(state: GameState) { const soldierFactor = state.researched.includes('tactics') ? 3 : 2; return state.resources.defense.amount + state.resources.soldiers.amount * soldierFactor }
