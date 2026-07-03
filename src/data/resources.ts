import type { ResourceId } from '../engine/types'

export const resourceLabels: Record<ResourceId, { name: string; icon: string }> = {
  wood: { name: 'Madera', icon: '🪵' },
  food: { name: 'Comida', icon: '🥖' },
  stone: { name: 'Piedra', icon: '🪨' },
  population: { name: 'Población', icon: '👥' },
  knowledge: { name: 'Conocimiento', icon: '📐' },
  defense: { name: 'Defensa', icon: '🛡️' },
}
