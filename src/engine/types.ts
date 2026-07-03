export type ResourceId = 'wood' | 'food' | 'stone' | 'population' | 'knowledge' | 'defense'
export type BuildingId = 'townCenter' | 'house' | 'lumberCamp' | 'farm' | 'quarry' | 'school' | 'warehouse' | 'barracks' | 'wall' | 'road'

export type ResourceStore = Record<ResourceId, { amount: number; capacity: number; producedPerMinute: number; consumedPerMinute: number }>

export interface Cost { resource: ResourceId; amount: number }
export interface ResourceFlow { resource: ResourceId; amountPerMinute: number }

export interface BuildingDefinition {
  id: BuildingId
  name: string
  icon: string
  description: string
  cost: Cost[]
  maxWorkers: number
  production: ResourceFlow[]
  consumption: ResourceFlow[]
  populationCapacityBonus?: number
  storageBonus?: Partial<Record<ResourceId, number>>
  passiveDefense?: number
  requiresConnection?: boolean
}

export interface BuildingInstance {
  uid: string
  type: BuildingId
  x: number
  y: number
  workers: number
  connected: boolean
  efficiency: number
}

export interface Objective { id: string; title: string; description: string; completed: boolean }
export interface Threat { id: string; name: string; strength: number; secondsUntilAttack: number }
export interface AttackLog { message: string; won: boolean; time: number }
export interface Message { id: string; text: string; tone: 'info' | 'success' | 'warning' | 'danger' }

export interface GameState {
  version: string
  width: number
  height: number
  resources: ResourceStore
  buildings: BuildingInstance[]
  selectedBuildingToBuild?: BuildingId
  selectedTile?: { x: number; y: number }
  paused: boolean
  speed: 1 | 2 | 4
  time: number
  advisorLevel: 0 | 1 | 2
  objectives: Objective[]
  threats: Threat[]
  nextThreatIn: number
  attacksSurvived: number
  messages: Message[]
  mvpCompleted: boolean
}

export interface ProductionReport {
  produced: Partial<Record<ResourceId, number>>
  consumed: Partial<Record<ResourceId, number>>
  netPerMinute: Partial<Record<ResourceId, number>>
  limitingResource?: ResourceId
}
