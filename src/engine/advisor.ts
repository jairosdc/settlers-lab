import { buildingDefinitions } from '../data/buildings'
import { resourceLabels } from '../data/resources'
import { availableWorkers } from './city'
import { calculateProduction } from './production'
import type { GameState } from './types'
export function getAdvisorMessages(state: GameState): string[] {
 if (state.advisorLevel === 0) return ['Completa objetivos para desbloquear diagnósticos.']
 const report = calculateProduction(state); const messages: string[] = []
 if ((report.netPerMinute.food ?? 0) < 0) messages.push('Falta comida: construye una granja o asigna agricultores.')
 if (state.resources.wood.amount < 20) messages.push('Falta madera: refuerza el campamento maderero.')
 if (state.resources.stone.amount < 15) messages.push('Falta piedra: construye o conecta una cantera.')
 if (availableWorkers(state) > 0) messages.push(`Tienes ${availableWorkers(state)} trabajadores sin asignar.`)
 const disconnected = state.buildings.find((b) => buildingDefinitions[b.type].requiresConnection && !b.connected)
 if (disconnected) messages.push(`Conecta ${buildingDefinitions[disconnected.type].name} con caminos para producir al 100%.`)
 const threat = state.threats[0]; if (threat && state.resources.defense.amount < threat.strength) messages.push('Defensa baja ante amenaza próxima: construye muralla o activa el cuartel.')
 if (state.advisorLevel >= 2) { const limiting = report.limitingResource; if (limiting) messages.unshift(`Recomendación: mejora ${resourceLabels[limiting].name.toLowerCase()}, ahora limita tu expansión.`) }
 return messages.length ? messages : ['La ciudad está estable. Busca crecer población y defensa.']
}
