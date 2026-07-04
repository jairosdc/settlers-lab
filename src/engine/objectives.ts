import { countBuildings } from './city'
import { calculateProduction } from './production'
import type { GameState } from './types'
export function updateObjectives(state: GameState): GameState { const net=calculateProduction(state).netPerMinute; const checks:Record<string,boolean>={ 'stable-food':(net.food??0)>0, sawmill:countBuildings(state,'sawmill')>=1, planks:state.resources.planks.amount>=20, logistics:state.researched.includes('logisticsI'), tools:state.resources.tools.amount>=5, industrial:state.researched.includes('industrialPlanning'), soldiers:state.resources.soldiers.amount>=3, attack:state.attacksSurvived>=1, metal:state.resources.metal.amount>=5 }; return {...state,objectives:state.objectives.map(o=>({...o,completed:o.completed||checks[o.id]||false}))} }
export function isMvpCompleted(state:GameState){return state.researched.includes('metalwork') && state.resources.population.amount>=18 && state.attacksSurvived>=2 && state.resources.metal.amount>=5}
