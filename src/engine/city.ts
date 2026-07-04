import { processes } from '../data/processes'
import { resources as resourceDefinitions } from '../data/resources'
import { recipes } from '../data/recipes'
import { initialObjectives } from '../data/objectives'
import { SAVE_VERSION } from './constants'
import { computeOptimizationScore } from './formulas'
import { createInitialResources, refreshResourceVisibility } from './resources'
import type { GameState, ProcessId, ProcessInstance, ResourceId } from './types'
const id=()=>globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
export function createInitialState(): GameState { const initial:ProcessId[]=['townCenter']; const processInstances=initial.map((type):ProcessInstance=>({uid:type,type,workers:0,paused:false,efficiency:1,logisticsEfficiency:1,priority:1,status:'Funcionando',x:processes[type].position.x,y:processes[type].position.y,connected:true,activeRecipeId:processes[type].recipeId})); const state:GameState={version:SAVE_VERSION,resources:createInitialResources(),processes:processInstances,buildings:processInstances,connections:createBaseConnections(),paused:false,speed:1,time:0,researched:[],advisorLevel:0,objectives:initialObjectives(),perturbations:[{id:id(),name:'Fallo logístico',type:'logistics_failure',intensity:42,secondsUntil:360,durationSeconds:180}],threats:[],nextPerturbationIn:360,messages:[{id:id(),text:'Settlers Lab: laboratorio de optimización industrial. Diseña una red, no una maqueta.',tone:'info'}],history:[],optimization:{optimizationScore:0,trend:0,processEfficiency:1,logisticsEfficiency:1,workerUtilization:0,resourceStability:1,resilienceScore:.3,activeProcessRatio:1,mainLoss:'Inicializando métricas',penalties:0,bottlenecks:[]},flowWeights:{wood:{sawmill:.5,brickworks:.2,reserve:.3},stone:{brickworks:.55,reserve:.45},food:{bakery:.4,basicHousing:.3,school:.2,reserve:.1}},attacksSurvived:0}; return recalculateCapacities({...state,optimization:computeOptimizationScore(state)}) }
function createBaseConnections(){ return [
 {id:'wood-sawmill',from:'forest',to:'sawmill',resource:'wood',capacityPerMinute:18,weight:.5,efficiency:.82,active:true},
 {id:'wood-bricks',from:'forest',to:'brickworks',resource:'wood',capacityPerMinute:8,weight:.2,efficiency:.72,active:true},
 {id:'stone-bricks',from:'quarry',to:'brickworks',resource:'stone',capacityPerMinute:12,weight:.55,efficiency:.68,active:true},
 {id:'food-bakery',from:'farm',to:'bakery',resource:'food',capacityPerMinute:14,weight:.4,efficiency:.78,active:true},
 {id:'food-housing',from:'farm',to:'basicHousing',resource:'food',capacityPerMinute:10,weight:.3,efficiency:.86,active:true},
 {id:'planks-housing2',from:'sawmill',to:'improvedHousing',resource:'planks',capacityPerMinute:7,weight:.5,efficiency:.65,active:true},
 {id:'bricks-housing2',from:'brickworks',to:'improvedHousing',resource:'bricks',capacityPerMinute:7,weight:.5,efficiency:.65,active:true},
 ] as GameState['connections'] }
export function availableWorkers(state:GameState){return Math.max(0,Math.floor(state.resources.population.amount)-assignedWorkers(state))}
export function assignedWorkers(state:GameState){return state.processes.reduce((s,p)=>s+p.workers,0)}
export function countBuildings(state:GameState,type:ProcessId){return state.processes.filter(p=>p.type===type).length}
export function populationCapacity(state:GameState){return 10+state.processes.reduce((s,p)=>s+(processes[p.type].populationCapacityBonus??0),0)}
export function recalculateCapacities(state:GameState):GameState{ const resources=structuredClone(state.resources); for(const r of Object.keys(resources) as ResourceId[]) resources[r].capacity=r==='population'?populationCapacity(state):resourceDefinitions[r].baseCapacity; for(const p of state.processes){ const bonus=processes[p.type].storageBonus; if(bonus) for(const [r,v] of Object.entries(bonus) as [ResourceId,number][]) resources[r].capacity+=v } return {...state,resources:refreshResourceVisibility(resources,state.processes.map(p=>p.type),state.researched),buildings:state.processes} }
export function isUnlocked(state:GameState,type:ProcessId){ const u=processes[type].unlockedBy; return !u || state.researched.includes(u) }
export function canAfford(state:GameState,type:ProcessId){ return Object.entries(processes[type].buildCost).every(([r,a])=>state.resources[r as ResourceId].amount>=a) }
export function buildProcess(state:GameState,type:ProcessId){ if(state.processes.some(p=>p.type===type)) return {state,error:'Este proceso ya está instalado en la red actual.'}; if(!isUnlocked(state,type)) return {state,error:'Falta investigación para desbloquear este proceso.'}; if(!canAfford(state,type)) return {state,error:'Recursos insuficientes para activar el proceso.'}; const resources=structuredClone(state.resources); for(const [r,a] of Object.entries(processes[type].buildCost) as [ResourceId,number][]) resources[r].amount-=a; const def=processes[type]; const proc:ProcessInstance={uid:id(),type,workers:0,paused:false,efficiency:1,logisticsEfficiency:.8,priority:1,status:'Sin trabajadores',x:def.position.x,y:def.position.y,connected:true,activeRecipeId:def.recipeId}; return {state:recalculateCapacities({...state,resources,processes:[...state.processes,proc],buildings:[...state.processes,proc]})} }
export const buildAt=(state:GameState,type:ProcessId,_x=0,_y=0)=>buildProcess(state,type)
export function changeProcessWorkers(state:GameState,uid:string,delta:number){ const free=availableWorkers(state); const processesNext=state.processes.map(p=>p.uid===uid?{...p,workers:Math.max(0,Math.min(processes[p.type].maxWorkers,p.workers+(delta>0?Math.min(delta,free):delta)))}:p); return {...state,processes:processesNext,buildings:processesNext} }
export function setProcessWorkers(state:GameState,uid:string,value:number){ const current=state.processes.find(p=>p.uid===uid); if(!current) return state; return changeProcessWorkers(state,uid,value-current.workers) }
export const demolishBuilding=(state:GameState,uid:string)=>{ const p=state.processes.find(x=>x.uid===uid); if(!p||p.type==='townCenter') return state; const next=state.processes.filter(x=>x.uid!==uid); return {...state,processes:next,buildings:next} }
export const moveBuilding=(state:GameState)=>state
export const recalculateLogistics=(state:GameState)=>state
export { recipes }
