import { buildingDefinitions } from '../data/buildings.js';
import { resources as resourceDefinitions } from '../data/resources.js';
import { initialObjectives } from '../data/objectives.js';
import { GRID_HEIGHT, GRID_WIDTH, SAVE_VERSION, TOWN_CENTER_X, TOWN_CENTER_Y } from './constants.js';
import { recalculateLogistics } from './logistics.js';
import { createInitialResources, refreshResourceVisibility } from './resources.js';
export function createInitialState() { const townCenter = { uid: 'town-center', type: 'townCenter', x: TOWN_CENTER_X, y: TOWN_CENTER_Y, workers: 0, connected: true, efficiency: 1 }; return { version: SAVE_VERSION, width: GRID_WIDTH, height: GRID_HEIGHT, resources: createInitialResources(), buildings: [townCenter], paused: false, speed: 1, time: 0, researched: [], advisorLevel: 0, objectives: initialObjectives(), threats: [], nextThreatIn: 420, attacksSurvived: 0, messages: [{ id: crypto.randomUUID(), text: 'Bienvenido a Settlers Lab: optimiza cadenas, carreteras y trabajadores escasos.', tone: 'info' }], mvpCompleted: false }; }
export function getBuildingAt(state, x, y) { return state.buildings.find(b => b.x === x && b.y === y); }
export function countBuildings(state, type) { return state.buildings.filter(b => b.type === type).length; }
export function assignedWorkers(state) { return state.buildings.reduce((s, b) => s + b.workers, 0); }
export function availableWorkers(state) { return Math.max(0, Math.floor(state.resources.population.amount) - assignedWorkers(state)); }
export function populationCapacity(state) { return 8 + state.buildings.reduce((s, b) => s + (buildingDefinitions[b.type].populationCapacityBonus ?? 0), 0); }
export function recalculateCapacities(state) { const resources = structuredClone(state.resources); Object.keys(resources).forEach(r => { resources[r].capacity = r === 'population' ? populationCapacity(state) : resourceDefinitions[r].baseCapacity; }); for (const b of state.buildings) {
    const bonus = buildingDefinitions[b.type].storageBonus;
    if (bonus)
        for (const [r, v] of Object.entries(bonus))
            resources[r].capacity += v ?? 0;
} return { ...state, resources: refreshResourceVisibility(resources, state.buildings.map(b => b.type), state.researched) }; }
export function canAfford(state, type) { return buildingDefinitions[type].cost.every(c => state.resources[c.resource].amount >= c.amount); }
export function isUnlocked(state, type) { const req = buildingDefinitions[type].requiredTech; return !req || state.researched.includes(req); }
export function buildAt(state, type, x, y) { if (x < 0 || y < 0 || x >= state.width || y >= state.height)
    return { state, error: 'Fuera de la cuadrícula.' }; if (getBuildingAt(state, x, y))
    return { state, error: 'La celda ya está ocupada.' }; if (!isUnlocked(state, type))
    return { state, error: 'Falta tecnología para este edificio.' }; if (!canAfford(state, type))
    return { state, error: 'No tienes recursos suficientes.' }; const resources = structuredClone(state.resources); buildingDefinitions[type].cost.forEach(c => resources[c.resource].amount -= c.amount); const def = buildingDefinitions[type]; const building = { uid: crypto.randomUUID(), type, x, y, workers: 0, connected: false, efficiency: 1, activeRecipeId: def.recipeIds[0] }; return { state: recalculateLogistics(recalculateCapacities({ ...state, resources, buildings: [...state.buildings, building] })) }; }
export function demolishBuilding(state, uid) { const b = state.buildings.find(x => x.uid === uid); if (!b || buildingDefinitions[b.type].immovable)
    return state; return recalculateLogistics(recalculateCapacities({ ...state, buildings: state.buildings.filter(x => x.uid !== uid), messages: [{ id: crypto.randomUUID(), text: 'Edificio demolido. No se reembolsan costes en esta fase.', tone: 'warning' }, ...state.messages].slice(0, 6) })); }
export function moveBuilding(state, uid, x, y) { if (!state.researched.includes('relocation'))
    return state; if (getBuildingAt(state, x, y))
    return state; return recalculateLogistics({ ...state, buildings: state.buildings.map(b => b.uid === uid && !buildingDefinitions[b.type].immovable ? { ...b, x, y } : b), moveBuildingUid: undefined }); }
export { recalculateLogistics };
