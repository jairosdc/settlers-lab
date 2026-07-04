export type ResourceCategory = 'basic' | 'intermediate' | 'advanced' | 'population' | 'security'
export type ResourceId = 'wood' | 'food' | 'stone' | 'planks' | 'tools' | 'ore' | 'metal' | 'population' | 'knowledge' | 'defense' | 'soldiers'
export type BuildingCategory = 'infra' | 'extractors' | 'industry' | 'civic' | 'military' | 'logistics'
export type BuildingId = 'townCenter' | 'house' | 'lumberCamp' | 'farm' | 'quarry' | 'sawmill' | 'toolmaker' | 'mine' | 'foundry' | 'school' | 'laboratory' | 'warehouse' | 'barracks' | 'wall' | 'road'
export type TechnologyId = 'logisticsI' | 'industrialPlanning' | 'metalwork' | 'urbanExpansion' | 'relocation' | 'tactics'
export type RecipeId = string
export type ResourceStore = Record<ResourceId, { amount: number; capacity: number; producedPerMinute: number; consumedPerMinute: number; visible: boolean }>
export interface Cost { resource: ResourceId; amount: number }
export interface ResourceFlow { resource: ResourceId; amountPerMinute: number }
export interface ResourceDefinition { id: ResourceId; name: string; category: ResourceCategory; initiallyVisible: boolean; storage: boolean; baseCapacity: number; unlockedBy?: BuildingId | TechnologyId }
export interface RecipeDefinition { id: RecipeId; name: string; inputs: ResourceFlow[]; outputs: ResourceFlow[]; requiredTech?: TechnologyId; unlocksResources?: ResourceId[] }
export interface BuildingDefinition { id: BuildingId; name: string; icon: string; description: string; category: BuildingCategory; cost: Cost[]; maxWorkers: number; recipeIds: RecipeId[]; populationCapacityBonus?: number; storageBonus?: Partial<Record<ResourceId, number>>; passiveDefense?: number; requiresConnection?: boolean; requiredTech?: TechnologyId; road?: boolean; immovable?: boolean }
export interface TechnologyDefinition { id: TechnologyId; name: string; description: string; cost: Cost[]; prerequisites?: TechnologyId[] }
export interface BuildingInstance { uid: string; type: BuildingId; x: number; y: number; workers: number; connected: boolean; efficiency: number; activeRecipeId?: RecipeId }
export interface Objective { id: string; title: string; description: string; completed: boolean }
export interface Threat { id: string; name: string; strength: number; secondsUntilAttack: number; target: 'resources' | 'workers' | 'logistics' }
export interface Message { id: string; text: string; tone: 'info' | 'success' | 'warning' | 'danger' }
export interface GameState { version: string; width: number; height: number; resources: ResourceStore; buildings: BuildingInstance[]; selectedBuildingToBuild?: BuildingId; selectedTile?: { x: number; y: number }; moveBuildingUid?: string; paused: boolean; speed: 1 | 2 | 4; time: number; researched: TechnologyId[]; advisorLevel: 0 | 1 | 2; objectives: Objective[]; threats: Threat[]; nextThreatIn: number; attacksSurvived: number; messages: Message[]; mvpCompleted: boolean }
export interface ProductionReport { produced: Partial<Record<ResourceId, number>>; consumed: Partial<Record<ResourceId, number>>; netPerMinute: Partial<Record<ResourceId, number>>; bottlenecks: ResourceId[]; limitingResource?: ResourceId; utilization: Record<string, number> }
