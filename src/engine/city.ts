import { buildingDefinitions } from '../data/buildings'
import { CONNECTED_EFFICIENCY, DISCONNECTED_EFFICIENCY, GRID_HEIGHT, GRID_WIDTH, SAVE_VERSION, TOWN_CENTER_X, TOWN_CENTER_Y } from './constants'
import { createInitialResources } from './resources'
import type { BuildingId, BuildingInstance, GameState } from './types'
import { initialObjectives } from '../data/objectives'

export function createInitialState(): GameState {
  const townCenter: BuildingInstance = { uid: 'town-center', type: 'townCenter', x: TOWN_CENTER_X, y: TOWN_CENTER_Y, workers: 0, connected: true, efficiency: 1 }
  return { version: SAVE_VERSION, width: GRID_WIDTH, height: GRID_HEIGHT, resources: createInitialResources(), buildings: [townCenter], paused: false, speed: 1, time: 0, advisorLevel: 0, objectives: initialObjectives(), threats: [], nextThreatIn: 180, attacksSurvived: 0, messages: [{ id: crypto.randomUUID(), text: 'Bienvenido: construye granjas, caminos y talleres para estabilizar la ciudad.', tone: 'info' }], mvpCompleted: false }
}

export function getBuildingAt(state: GameState, x: number, y: number) { return state.buildings.find((b) => b.x === x && b.y === y) }
export function countBuildings(state: GameState, type: BuildingId) { return state.buildings.filter((b) => b.type === type).length }
export function assignedWorkers(state: GameState) { return state.buildings.reduce((sum, b) => sum + b.workers, 0) }
export function availableWorkers(state: GameState) { return Math.max(0, Math.floor(state.resources.population.amount) - assignedWorkers(state)) }

export function populationCapacity(state: GameState) {
  return 8 + state.buildings.reduce((sum, b) => sum + (buildingDefinitions[b.type].populationCapacityBonus ?? 0), 0)
}

export function recalculateCapacities(state: GameState): GameState {
  const resources = structuredClone(state.resources)
  resources.population.capacity = populationCapacity(state)
  ;(['wood', 'food', 'stone'] as const).forEach((r) => { resources[r].capacity = 100 + state.buildings.reduce((s, b) => s + (buildingDefinitions[b.type].storageBonus?.[r] ?? 0), 0) })
  return { ...state, resources }
}

export function canAfford(state: GameState, type: BuildingId) { return buildingDefinitions[type].cost.every((c) => state.resources[c.resource].amount >= c.amount) }

export function buildAt(state: GameState, type: BuildingId, x: number, y: number): { state: GameState; error?: string } {
  if (getBuildingAt(state, x, y)) return { state, error: 'La celda ya está ocupada.' }
  if (!canAfford(state, type)) return { state, error: 'No tienes recursos suficientes.' }
  const resources = structuredClone(state.resources)
  buildingDefinitions[type].cost.forEach((c) => { resources[c.resource].amount -= c.amount })
  const building: BuildingInstance = { uid: crypto.randomUUID(), type, x, y, workers: 0, connected: false, efficiency: 1 }
  return { state: recalculateLogistics(recalculateCapacities({ ...state, resources, buildings: [...state.buildings, building] })) }
}

export function recalculateLogistics(state: GameState): GameState {
  const roads = new Set(state.buildings.filter((b) => b.type === 'road' || b.type === 'townCenter').map((b) => `${b.x},${b.y}`))
  const visited = new Set<string>(); const queue = [[TOWN_CENTER_X, TOWN_CENTER_Y]]
  while (queue.length) { const [x, y] = queue.shift()!; const key = `${x},${y}`; if (visited.has(key) || !roads.has(key)) continue; visited.add(key); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => queue.push([x+dx,y+dy])) }
  const connectedAdj = (b: BuildingInstance) => b.type === 'townCenter' || b.type === 'road' || [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => visited.has(`${b.x+dx},${b.y+dy}`))
  return { ...state, buildings: state.buildings.map((b) => { const def = buildingDefinitions[b.type]; const connected = connectedAdj(b); return { ...b, connected, efficiency: def.requiresConnection && !connected ? DISCONNECTED_EFFICIENCY : CONNECTED_EFFICIENCY } }) }
}
