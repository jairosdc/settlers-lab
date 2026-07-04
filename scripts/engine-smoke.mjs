import assert from 'node:assert/strict'
import { createInitialState, buildAt } from '../dist-test/engine/city.js'
import { calculateProduction } from '../dist-test/engine/production.js'
import { researchTechnology } from '../dist-test/engine/research.js'
import { deserializeGame, serializeGame } from '../dist-test/engine/save.js'
import { tick } from '../dist-test/engine/tick.js'

let reset = deserializeGame(JSON.stringify({ version: '0.1.0', resources: {} }))
assert.equal(reset.version, createInitialState().version)
let state = createInitialState()
state.resources.wood.amount = 500; state.resources.stone.amount = 500; state.resources.wood.capacity = 1000; state.resources.stone.capacity = 1000
state = buildAt(state, 'sawmill', 7, 5).state
state = { ...state, buildings: state.buildings.map((b) => b.type === 'sawmill' ? { ...b, workers: 2 } : b) }
const report = calculateProduction(state)
assert.ok(report.produced.planks > 0)
assert.ok(report.consumed.wood > 0)
state.resources.knowledge.amount = 100
state = researchTechnology(state, 'logisticsI')
assert.ok(state.researched.includes('logisticsI'))
assert.equal(state.resources.knowledge.amount, 82)
assert.doesNotThrow(() => deserializeGame(serializeGame(tick(createInitialState(), 5))))
console.log('engine smoke tests passed')
