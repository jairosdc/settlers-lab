import { recalculateCapacities, recalculateLogistics } from './city.js';
import { updateObjectives, isMvpCompleted } from './objectives.js';
import { applyProduction } from './production.js';
import { updateResearch } from './research.js';
import { updateThreats } from './threats.js';
export function tick(state, seconds) { if (state.paused)
    return state; let next = recalculateLogistics(recalculateCapacities(state)); next = applyProduction(next, seconds); next = updateResearch(next); next = updateThreats({ ...next, time: next.time + seconds }, seconds); next = updateObjectives(next); const completed = isMvpCompleted(next); if (completed && !next.mvpCompleted)
    next = { ...next, messages: [{ id: crypto.randomUUID(), text: 'Has cerrado una cadena industrial completa y defendible. Fin de esta iteración.', tone: 'success' }, ...next.messages].slice(0, 6) }; return { ...next, mvpCompleted: next.mvpCompleted || completed }; }
