import { technologies } from '../data/technologies'
import { recalculateCapacities } from './city'
import type { GameState, TechnologyId } from './types'
export function canResearch(state:GameState,id:TechnologyId){ const tech=technologies.find(t=>t.id===id); return !!tech && !state.researched.includes(id) && (tech.prerequisites??[]).every(p=>state.researched.includes(p)) && tech.cost.every(c=>state.resources[c.resource].amount>=c.amount) }
export function researchTechnology(state:GameState,id:TechnologyId):GameState{ if(!canResearch(state,id)) return state; const tech=technologies.find(t=>t.id===id)!; const resources=structuredClone(state.resources); tech.cost.forEach(c=>resources[c.resource].amount-=c.amount); return recalculateCapacities({...state,resources,researched:[...state.researched,id],messages:[{id:crypto.randomUUID(),text:`Tecnología desbloqueada: ${tech.name}.`,tone:'success' as const},...state.messages].slice(0,6)}) }
export function updateResearch(state: GameState): GameState { const k=state.resources.knowledge.amount; const advisorLevel = state.researched.includes('industrialPlanning') ? 2 : k>=18 ? 1 : state.advisorLevel; return {...state,advisorLevel} }
