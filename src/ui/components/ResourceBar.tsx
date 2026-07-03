import { resourceLabels } from '../../data/resources'
import type { GameState, ResourceId } from '../../engine/types'
const ids: ResourceId[] = ['wood','food','stone','population','knowledge','defense']
export function ResourceBar({ state }: { state: GameState }) { return <section className="resources">{ids.map((id)=>{ const r=state.resources[id]; const net=r.producedPerMinute-r.consumedPerMinute; return <div className="resource" key={id}><span>{resourceLabels[id].icon} {resourceLabels[id].name}</span><strong>{r.amount.toFixed(1)} / {r.capacity}</strong><small className={net>=0?'positive':'negative'}>{net>=0?'▲':'▼'} {net.toFixed(1)}/min</small></div> })}</section> }
