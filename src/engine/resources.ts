import type { ResourceId, ResourceStore } from './types'

export function createInitialResources(): ResourceStore {
  return {
    wood: { amount: 90, capacity: 180, producedPerMinute: 0, consumedPerMinute: 0 },
    food: { amount: 75, capacity: 180, producedPerMinute: 0, consumedPerMinute: 0 },
    stone: { amount: 45, capacity: 160, producedPerMinute: 0, consumedPerMinute: 0 },
    population: { amount: 6, capacity: 8, producedPerMinute: 0, consumedPerMinute: 0 },
    knowledge: { amount: 0, capacity: 100, producedPerMinute: 0, consumedPerMinute: 0 },
    defense: { amount: 4, capacity: 120, producedPerMinute: 0, consumedPerMinute: 0 },
  }
}

export function addResource(resources: ResourceStore, id: ResourceId, delta: number): ResourceStore {
  const current = resources[id]
  return { ...resources, [id]: { ...current, amount: Math.max(0, Math.min(current.capacity, current.amount + delta)) } }
}
