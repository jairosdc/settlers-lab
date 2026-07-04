import { recalculateCapacities } from './city'
import { computeOptimizationScore } from './formulas'
import { updateObjectives } from './objectives'
import { applyProduction } from './production'
import { updateResearch } from './research'
import { updateThreats } from './threats'
import type { GameState } from './types'
export function tick(state:GameState,seconds:number):GameState{ if(state.paused) return state; let next=recalculateCapacities(state); next=applyProduction(next,seconds); next={...next,time:next.time+seconds}; next={...next,optimization:computeOptimizationScore(next)}; next={...next,history:[...next.history,{time:next.time,...next.optimization}].slice(-120)}; next=updateResearch(next); next=updateThreats(next,seconds); next=updateObjectives(next); return next }
