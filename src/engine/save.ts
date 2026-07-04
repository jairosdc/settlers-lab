import { SAVE_KEY, SAVE_VERSION } from './constants'
import { createInitialState, recalculateCapacities } from './city'
import { computeOptimizationScore } from './formulas'
import type { GameState } from './types'
export function serializeGame(state:GameState){ return JSON.stringify({...state,version:SAVE_VERSION},null,2) }
export function deserializeGame(raw:string):GameState{ try{ const parsed=JSON.parse(raw) as Partial<GameState>; if(parsed.version!==SAVE_VERSION){ const fresh=createInitialState(); return {...fresh,saveNotice:'El guardado anterior no era compatible con esta versión. Se ha iniciado una nueva simulación.'} } const base=createInitialState(); const merged={...base,...parsed,version:SAVE_VERSION} as GameState; const recalculated=recalculateCapacities(merged); return {...recalculated,optimization:computeOptimizationScore(recalculated)} }catch{ const fresh=createInitialState(); return {...fresh,saveNotice:'El guardado anterior no era compatible con esta versión. Se ha iniciado una nueva simulación.'} } }
export function saveToLocalStorage(state:GameState){ localStorage.setItem(SAVE_KEY,serializeGame(state)) }
export function loadFromLocalStorage():GameState|undefined{ const raw=localStorage.getItem(SAVE_KEY); return raw?deserializeGame(raw):undefined }
