import { buildingDefinitions } from '../data/buildings'
import type { GameState, ProductionReport, ResourceId } from './types'

export function calculateProduction(state: GameState): ProductionReport {
  const produced: Partial<Record<ResourceId, number>> = {}
  const consumed: Partial<Record<ResourceId, number>> = {}
  for (const b of state.buildings) {
    const def = buildingDefinitions[b.type]
    const workerFactor = def.maxWorkers > 0 ? b.workers : 1
    for (const p of def.production) produced[p.resource] = (produced[p.resource] ?? 0) + p.amountPerMinute * workerFactor * b.efficiency
    for (const c of def.consumption) consumed[c.resource] = (consumed[c.resource] ?? 0) + c.amountPerMinute * Math.max(1, workerFactor) * b.efficiency
    if (def.passiveDefense) produced.defense = (produced.defense ?? 0) + def.passiveDefense / 60
  }
  const netPerMinute: Partial<Record<ResourceId, number>> = {}
  ;(['wood','food','stone','population','knowledge','defense'] as ResourceId[]).forEach((r) => { netPerMinute[r] = (produced[r] ?? 0) - (consumed[r] ?? 0) })
  const limitingResource = (['food','wood','stone'] as ResourceId[]).find((r) => (netPerMinute[r] ?? 0) < 0 || state.resources[r].amount < state.resources[r].capacity * 0.15)
  return { produced, consumed, netPerMinute, limitingResource }
}

export function applyProduction(state: GameState, seconds: number): GameState {
  const report = calculateProduction(state)
  const resources = structuredClone(state.resources)
  ;(Object.keys(resources) as ResourceId[]).forEach((r) => {
    resources[r].producedPerMinute = report.produced[r] ?? 0
    resources[r].consumedPerMinute = report.consumed[r] ?? 0
    resources[r].amount = Math.max(0, Math.min(resources[r].capacity, resources[r].amount + ((report.netPerMinute[r] ?? 0) * seconds) / 60))
  })
  return { ...state, resources }
}
