import { calculateProduction } from './production'
import type { GameState } from './types'
export function updateObjectives(state:GameState):GameState{ const report=calculateProduction(state); const checks:Record<string,boolean>={ 'plank-chain':(report.netPerMinute.planks??0)>0, 'first-bottleneck':report.bottlenecks.length===0&&state.time>30, opt70:state.optimization.optimizationScore>=70, logistics80:state.optimization.logisticsEfficiency>=.8, resilience50:state.resources.resilience.amount>=50, horizon2:state.researched.some(t=>['basic_carpentry','brickmaking','baking'].includes(t))}; return {...state,objectives:state.objectives.map(o=>({...o,completed:o.completed||!!checks[o.id],progress:checks[o.id]?1:o.progress}))} }
export const isMvpCompleted=()=>false
