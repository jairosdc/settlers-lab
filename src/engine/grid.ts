import type { GameState } from './types'
export function expandGrid(state: GameState): GameState { if(!state.researched.includes('urbanExpansion')) return state; return {...state,width:state.width+4,height:state.height+3,messages:[{id:crypto.randomUUID(),text:'Cuadrícula ampliada para el siguiente bloque industrial.',tone:'success' as const},...state.messages].slice(0,6)} }
