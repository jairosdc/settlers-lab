import { resources } from '../../data/resources'
import type { GameState, ResourceId } from '../../engine/types'
const ids = Object.keys(resources) as ResourceId[]
export function ResourceBar({ state }: { state: GameState }) { return <section className="resources">{ids.filter(id=>state.resources[id].visible).map(id=>{ const r=state.resources[id]; const net=r.producedPerMinute-r.consumedPerMinute; return <div className="resource" key={id}><span>{resources[id].name}</span><strong>{r.amount.toFixed(1)} / {r.capacity}</strong><small className={net>=0?'positive':'negative'}>{net>=0?'▲':'▼'} {net.toFixed(2)}/min</small></div> })}</section> }
