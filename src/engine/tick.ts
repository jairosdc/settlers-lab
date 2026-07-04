import { recalculateCapacities, recalculateLogistics } from './city'
import { updateObjectives, isMvpCompleted } from './objectives'
import { applyProduction } from './production'
import { updateResearch } from './research'
import { updateThreats } from './threats'
import type { GameState } from './types'
export function tick(state: GameState, seconds: number): GameState { if(state.paused) return state; let next=recalculateLogistics(recalculateCapacities(state)); next=applyProduction(next,seconds); next=updateResearch(next); next=updateThreats({...next,time:next.time+seconds},seconds); next=updateObjectives(next); const completed=isMvpCompleted(next); if(completed&&!next.mvpCompleted) next={...next,messages:[{id:crypto.randomUUID(),text:'Has cerrado una cadena industrial completa y defendible. Fin de esta iteración.',tone:'success' as const},...next.messages].slice(0,6)}; return {...next,mvpCompleted:next.mvpCompleted||completed} }
