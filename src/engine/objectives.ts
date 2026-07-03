import { calculateProduction } from './production'
import { countBuildings } from './city'
import type { GameState } from './types'
export function updateObjectives(state: GameState): GameState {
 const netFood = calculateProduction(state).netPerMinute.food ?? 0
 const checks: Record<string, boolean> = { 'two-houses': countBuildings(state,'house')>=2, 'ten-pop': state.resources.population.amount>=10, 'positive-food': netFood>0, quarry: countBuildings(state,'quarry')>=1, school: countBuildings(state,'school')>=1, 'knowledge-20': state.resources.knowledge.amount>=20, 'advisor-1': state.advisorLevel>=1, barracks: countBuildings(state,'barracks')>=1, wall: countBuildings(state,'wall')>=1, 'first-attack': state.attacksSurvived>=1 }
 return { ...state, objectives: state.objectives.map((o) => ({ ...o, completed: o.completed || checks[o.id] || false })) }
}
export function isMvpCompleted(state: GameState) { return state.resources.population.amount>=50 && countBuildings(state,'school')>=1 && state.advisorLevel>=2 && countBuildings(state,'barracks')>=1 && countBuildings(state,'wall')>=1 && state.attacksSurvived>=3 }
