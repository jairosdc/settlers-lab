import { resolveAttack } from './military'
import type { GameState, Threat } from './types'
export function updateThreats(state: GameState, seconds: number): GameState {
 let nextThreatIn = state.nextThreatIn - seconds; let threats = state.threats.map((t) => ({ ...t, secondsUntilAttack: t.secondsUntilAttack - seconds })); let next = { ...state, nextThreatIn, threats }
 if (nextThreatIn <= 0 && threats.length === 0) { const strength = 10 + state.attacksSurvived * 6 + Math.floor(state.time / 240); const threat: Threat = { id: crypto.randomUUID(), name: 'Bandidos', strength, secondsUntilAttack: 90 }; next = { ...next, nextThreatIn: 240, threats: [threat], messages: [{ id: crypto.randomUUID(), text: `Amenaza detectada: bandidos fuerza ${strength} llegarán en 90s.`, tone: 'warning' as const }, ...state.messages].slice(0,6) } }
 const due = next.threats.filter((t) => t.secondsUntilAttack <= 0)
 for (const t of due) next = resolveAttack(next, t)
 return { ...next, threats: next.threats.filter((t) => t.secondsUntilAttack > 0) }
}
