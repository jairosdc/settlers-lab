import { SAVE_KEY, SAVE_VERSION } from './constants.js';
import { createInitialState, recalculateCapacities, recalculateLogistics } from './city.js';
export function serializeGame(state) { return JSON.stringify({ ...state, version: SAVE_VERSION }, null, 2); }
export function deserializeGame(raw) { const parsed = JSON.parse(raw); if (parsed.version !== SAVE_VERSION)
    return createInitialState(); return recalculateLogistics(recalculateCapacities({ ...createInitialState(), ...parsed, version: SAVE_VERSION })); }
export function saveToLocalStorage(state) { localStorage.setItem(SAVE_KEY, serializeGame(state)); }
export function loadFromLocalStorage() { const raw = localStorage.getItem(SAVE_KEY); return raw ? deserializeGame(raw) : undefined; }
