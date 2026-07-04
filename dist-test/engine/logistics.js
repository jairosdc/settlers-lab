import { buildingDefinitions } from '../data/buildings.js';
import { TOWN_CENTER_X, TOWN_CENTER_Y } from './constants.js';
import { logisticEfficiency } from './formulas.js';
export function recalculateLogistics(state) { const roads = new Set(state.buildings.filter(b => buildingDefinitions[b.type].road || b.type === 'townCenter').map(b => `${b.x},${b.y}`)); const visited = new Set(); const q = [[TOWN_CENTER_X, TOWN_CENTER_Y]]; while (q.length) {
    const [x, y] = q.shift();
    const k = `${x},${y}`;
    if (visited.has(k) || !roads.has(k))
        continue;
    visited.add(k);
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => q.push([x + dx, y + dy]));
} const roadTech = state.researched.includes('logisticsI'); const connectedAdj = (b) => b.type === 'townCenter' || buildingDefinitions[b.type].road || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => visited.has(`${b.x + dx},${b.y + dy}`)); return { ...state, buildings: state.buildings.map(b => { const connected = connectedAdj(b); const def = buildingDefinitions[b.type]; return { ...b, connected, efficiency: def.requiresConnection || def.road ? logisticEfficiency(connected, roadTech) : 1 }; }) }; }
