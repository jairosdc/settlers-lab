import { countBuildings } from './city'
import type { GameState } from './types'
export function updateResearch(state: GameState): GameState {
 let advisorLevel = state.advisorLevel
 if (countBuildings(state, 'school') > 0 && state.resources.knowledge.amount >= 10) advisorLevel = Math.max(advisorLevel, 1) as 0|1|2
 if (state.resources.knowledge.amount >= 35) advisorLevel = 2
 return { ...state, advisorLevel }
}
