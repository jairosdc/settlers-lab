import { buildingDefinitions } from '../data/buildings.js';
import { recipes } from '../data/recipes.js';
import { recipeThroughput } from './formulas.js';
export function calculateProduction(state) { const produced = {}; const consumed = {}; const bottlenecks = new Set(); const utilization = {}; for (const b of state.buildings) {
    const def = buildingDefinitions[b.type];
    if (def.passiveDefense)
        produced.defense = (produced.defense ?? 0) + def.passiveDefense / 60;
    const recipeId = b.activeRecipeId ?? def.recipeIds[0];
    if (!recipeId)
        continue;
    const recipe = recipes[recipeId];
    if (!recipe || (recipe.requiredTech && !state.researched.includes(recipe.requiredTech)))
        continue;
    const base = def.maxWorkers > 0 ? recipeThroughput(b) : b.efficiency;
    let availability = 1;
    for (const input of recipe.inputs) {
        const need = input.amountPerMinute * base;
        const stock = state.resources[input.resource].amount;
        if (need > 0 && stock < need / 6) {
            availability = Math.min(availability, Math.max(0, stock / (need / 6)));
            bottlenecks.add(input.resource);
        }
    }
    const factor = base * availability;
    utilization[b.uid] = availability;
    for (const input of recipe.inputs)
        consumed[input.resource] = (consumed[input.resource] ?? 0) + input.amountPerMinute * factor;
    for (const output of recipe.outputs)
        produced[output.resource] = (produced[output.resource] ?? 0) + output.amountPerMinute * factor;
} const netPerMinute = {}; Object.keys(state.resources).forEach(r => netPerMinute[r] = (produced[r] ?? 0) - (consumed[r] ?? 0)); const limitingResource = [...bottlenecks][0] ?? Object.keys(state.resources).find(r => state.resources[r].visible && ((netPerMinute[r] ?? 0) < 0 || state.resources[r].amount < state.resources[r].capacity * .08)); return { produced, consumed, netPerMinute, bottlenecks: [...bottlenecks], limitingResource, utilization }; }
export function applyProduction(state, seconds) { const report = calculateProduction(state); const resources = structuredClone(state.resources); Object.keys(resources).forEach(r => { resources[r].producedPerMinute = report.produced[r] ?? 0; resources[r].consumedPerMinute = report.consumed[r] ?? 0; resources[r].amount = Math.max(0, Math.min(resources[r].capacity, resources[r].amount + ((report.netPerMinute[r] ?? 0) * seconds) / 60)); }); return { ...state, resources }; }
