import type { GameState, Threat } from './types'
export function resolveAttack(state: GameState, threat: Threat): GameState {
 const resources = structuredClone(state.resources); const defense = resources.defense.amount
 if (defense >= threat.strength) { resources.defense.amount = Math.max(0, defense - threat.strength * 0.15); return { ...state, resources, attacksSurvived: state.attacksSurvived + 1, messages: [{ id: crypto.randomUUID(), text: `Los bandidos atacaron con fuerza ${threat.strength}. Tu defensa ${defense.toFixed(0)} resistió.`, tone: 'success' as const }, ...state.messages].slice(0,6) } }
 const lostWood = Math.min(resources.wood.amount, 30); const lostFood = Math.min(resources.food.amount, 15); const lostDefense = Math.min(resources.defense.amount, 2)
 resources.wood.amount -= lostWood; resources.food.amount -= lostFood; resources.defense.amount -= lostDefense
 return { ...state, resources, messages: [{ id: crypto.randomUUID(), text: `Los bandidos vencieron: defensa ${defense.toFixed(0)} vs fuerza ${threat.strength}. Pierdes ${lostWood} madera, ${lostFood} comida y ${lostDefense} defensa.`, tone: 'danger' as const }, ...state.messages].slice(0,6) }
}
