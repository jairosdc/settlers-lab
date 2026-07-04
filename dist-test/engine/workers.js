import { buildingDefinitions } from '../data/buildings.js';
import { availableWorkers } from './city.js';
export function changeWorkers(state, uid, delta) {
    const b = state.buildings.find((item) => item.uid === uid);
    if (!b)
        return state;
    const max = buildingDefinitions[b.type].maxWorkers;
    if (delta > 0 && availableWorkers(state) < delta)
        return { ...state, messages: [{ id: crypto.randomUUID(), text: 'No hay población disponible.', tone: 'warning' }, ...state.messages].slice(0, 6) };
    return { ...state, buildings: state.buildings.map((item) => item.uid === uid ? { ...item, workers: Math.max(0, Math.min(max, item.workers + delta)) } : item) };
}
