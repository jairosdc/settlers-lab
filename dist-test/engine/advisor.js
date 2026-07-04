import { buildingDefinitions } from '../data/buildings.js';
import { resourceLabels } from '../data/resources.js';
import { availableWorkers } from './city.js';
import { calculateProduction } from './production.js';
export function getAdvisorMessages(state) { if (state.advisorLevel === 0)
    return ['Genera conocimiento para desbloquear diagnósticos cuantitativos.']; const report = calculateProduction(state); const messages = []; if (report.limitingResource)
    messages.push(`Cuello de botella: ${resourceLabels[report.limitingResource].name}. Revisa entradas, trabajadores y stock.`); if (availableWorkers(state) > 0)
    messages.push(`Tienes ${availableWorkers(state)} trabajadores sin asignar: aumenta throughput donde el neto sea negativo.`); const disconnected = state.buildings.find(b => buildingDefinitions[b.type].requiresConnection && !b.connected); if (disconnected)
    messages.push(`${buildingDefinitions[disconnected.type].name} opera con baja eficiencia: conecta carretera adyacente al centro.`); if ((report.netPerMinute.planks ?? 0) < 0)
    messages.push('La cadena de tablones consume más de lo que produce: añade aserradero o trabajadores.'); if (state.advisorLevel >= 2) {
    const worst = Object.entries(report.netPerMinute).filter(([r]) => state.resources[r].visible).sort((a, b) => a[1] - b[1])[0];
    if (worst)
        messages.unshift(`Diagnóstico STEM: recurso con peor flujo neto = ${resourceLabels[worst[0]].name} (${worst[1].toFixed(2)}/min).`);
} return messages.length ? messages : ['Sistema estable. Siguiente meta: aumentar cadenas intermedias sin saturar comida.']; }
