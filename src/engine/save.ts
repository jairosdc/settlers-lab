import { SAVE_KEY, SAVE_VERSION } from './constants'
import { createInitialState, recalculateCapacities, recalculateLogistics } from './city'
import type { GameState } from './types'
export function serializeGame(state: GameState) { return JSON.stringify({ ...state, version: SAVE_VERSION }, null, 2) }
export function deserializeGame(raw: string): GameState { const parsed=JSON.parse(raw) as Partial<GameState>; if(parsed.version!==SAVE_VERSION) return createInitialState(); return recalculateLogistics(recalculateCapacities({...createInitialState(),...parsed,version:SAVE_VERSION} as GameState)) }
export function saveToLocalStorage(state: GameState) { localStorage.setItem(SAVE_KEY, serializeGame(state)) }
export function loadFromLocalStorage(): GameState | undefined { const raw=localStorage.getItem(SAVE_KEY); return raw ? deserializeGame(raw) : undefined }
