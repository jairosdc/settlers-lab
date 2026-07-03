import { buildingDefinitions } from '../../data/buildings'
import { availableWorkers } from '../../engine/city'
import type { GameState } from '../../engine/types'
export function WorkerPanel({ state, onChange }: { state: GameState; onChange:(uid:string,delta:number)=>void }) { const productive=state.buildings.filter(b=>buildingDefinitions[b.type].maxWorkers>0); return <section className="panel"><h2>Trabajadores</h2><p>Disponibles: <strong>{availableWorkers(state)}</strong></p>{productive.map(b=>{ const d=buildingDefinitions[b.type]; return <div className="worker" key={b.uid}><span>{d.icon} {d.name}</span><button onClick={()=>onChange(b.uid,-1)}>-</button><strong>{b.workers}/{d.maxWorkers}</strong><button onClick={()=>onChange(b.uid,1)}>+</button></div>})}</section> }
