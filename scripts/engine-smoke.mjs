import assert from 'node:assert/strict'
import { createInitialState, buildProcess, setProcessWorkers } from '../dist-test/engine/city.js'
import { calculateProduction } from '../dist-test/engine/production.js'
import { researchTechnology } from '../dist-test/engine/research.js'
import { deserializeGame, serializeGame } from '../dist-test/engine/save.js'
import { tick } from '../dist-test/engine/tick.js'
import { updateObjectives } from '../dist-test/engine/objectives.js'
import { computeOptimizationScore, computePerturbationRisk } from '../dist-test/engine/formulas.js'
import { getAdvisorMessages } from '../dist-test/engine/advisor.js'
let reset = deserializeGame(JSON.stringify({ version: '0.1.0', resources: {} }))
assert.equal(reset.version, createInitialState().version)
assert.ok(reset.saveNotice.includes('no era compatible'))
let state = createInitialState()
assert.deepEqual(state.processes.map(p=>p.type), ['townCenter'], 'inicio limpio solo con núcleo')
state = buildProcess(state, 'forest').state
state = setProcessWorkers(state, state.processes.find(p=>p.type==='forest').uid, 1)
let report = calculateProduction(state)
assert.ok(report.produced.wood > 0, 'producción por receta')
state = buildProcess(state, 'basicHousing').state
state = { ...state, processes: state.processes.map(p => p.type === 'basicHousing' ? { ...p, workers: 0 } : p) }
report = calculateProduction(state)
assert.equal(report.processReports[state.processes.find(p=>p.type==='basicHousing').uid].status, 'Sin trabajadores')
state.resources.wood.amount = 0
report = calculateProduction(state)
assert.ok(report.bottlenecks.includes('wood') || report.limitingResource === 'wood')
state.resources.wood.amount = 500; state.resources.stone.amount = 500; state.resources.knowledge.amount = 500
state = researchTechnology(state, 'basic_carpentry')
assert.ok(state.researched.includes('basic_carpentry'), 'investigación de tecnología')
assert.ok(state.resources.planks.visible, 'desbloqueo de recurso')
state = buildProcess(state, 'sawmill').state
assert.ok(state.processes.some(p=>p.type==='sawmill'), 'desbloqueo de proceso')
const saw = state.processes.find(p=>p.type==='sawmill')
state = setProcessWorkers(state, saw.uid, 2)
report = calculateProduction(state)
assert.ok(report.produced.planks > 0, 'producción de tablones')
const lowLog = { ...state, connections: state.connections.map(c => c.to === 'sawmill' ? { ...c, efficiency: .2 } : c) }
assert.ok(calculateProduction(lowLog).processReports[saw.uid].efficiency < calculateProduction(state).processReports[saw.uid].efficiency, 'limitada por logística')
assert.ok((report.netPerMinute.wood ?? 0) < report.produced.wood, 'producción neta')
assert.ok(computeOptimizationScore(state).optimizationScore >= 0, 'índice de optimización')
assert.ok(computeOptimizationScore(lowLog).bottlenecks.length > 0, 'cuellos de botella')
state.resources.resilience.amount = 100
assert.ok(computePerturbationRisk(state, 30) < .35, 'resiliencia ante perturbación')
state.resources.resilience.amount = 0
assert.ok(computePerturbationRisk(state, 90) > .35, 'perturbación no absorbida')
assert.ok(getAdvisorMessages({ ...state, advisorLevel: 1 }).some(m=>m.includes('Madera') || m.includes('limitante')), 'asesor detecta recurso limitante')
assert.ok(getAdvisorMessages({ ...state, processes: state.processes.map(p=>p.type==='sawmill'?{...p,workers:0,status:'Sin trabajadores'}:p), advisorLevel: 2 }).some(m=>m.includes('Aserradero') || m.includes('trabajadores')), 'asesor detecta proceso parado')
let advanced = updateObjectives({ ...state, resources: { ...state.resources, planks: { ...state.resources.planks, amount: 50, producedPerMinute: 4, consumedPerMinute: 0 } }, optimization: { ...state.optimization, optimizationScore: 75, logisticsEfficiency: .85 } })
assert.ok(advanced.objectives.some(o=>o.id==='opt70' && o.completed), 'contrato completado')
assert.ok(advanced.objectives.some(o=>o.id==='plank-chain' && o.completed), 'hito completado')
assert.doesNotThrow(() => deserializeGame(serializeGame(tick(createInitialState(), 5))))
console.log('engine smoke tests passed')
