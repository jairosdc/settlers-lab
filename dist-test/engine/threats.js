import { threatNames } from '../data/threats';
import { resolveAttack } from './military';
export function updateThreats(state, seconds) { let nextThreatIn = state.nextThreatIn - seconds; let threats = state.threats.map(t => ({ ...t, secondsUntilAttack: t.secondsUntilAttack - seconds })); let next = { ...state, nextThreatIn, threats }; if (nextThreatIn <= 0 && threats.length === 0) {
    const strength = Math.round(18 + state.attacksSurvived * 9 + state.time / 180);
    const threat = { id: crypto.randomUUID(), name: threatNames[state.attacksSurvived % threatNames.length], strength, secondsUntilAttack: 120, target: 'resources' };
    next = { ...next, nextThreatIn: 360, threats: [threat], messages: [{ id: crypto.randomUUID(), text: `Amenaza detectada: ${threat.name} fuerza ${strength}, llega en 120s.`, tone: 'warning' }, ...state.messages].slice(0, 6) };
} for (const t of next.threats.filter(t => t.secondsUntilAttack <= 0))
    next = resolveAttack(next, t); return { ...next, threats: next.threats.filter(t => t.secondsUntilAttack > 0) }; }
