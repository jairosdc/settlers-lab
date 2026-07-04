import { buildableIds, buildingDefinitions } from '../../data/buildings'
import { resourceLabels } from '../../data/resources'
import { isUnlocked } from '../../engine/city'
import type { BuildingId, GameState } from '../../engine/types'
import { GameIcon } from './icons/GameIcon'
const categories = ['infra','extractors','industry','civic','military','logistics'] as const
export function BuildMenu({ state, onSelect }: { state: GameState; onSelect:(id:BuildingId)=>void }) { return <section className="panel"><h2>Construcción</h2>{categories.map(cat=>{ const ids=buildableIds.filter(id=>buildingDefinitions[id].category===cat && isUnlocked(state,id)); if(!ids.length)return null; return <div key={cat}><h3>{cat}</h3>{ids.map(id=>{const d=buildingDefinitions[id]; return <button key={id} className={state.selectedBuildingToBuild===id?'active build':'build'} onClick={()=>onSelect(id)}><span><GameIcon id={d.icon}/> {d.name}</span><small>{d.cost.map(c=>`${c.amount} ${resourceLabels[c.resource].name}`).join(' · ') || 'Gratis'}</small></button>})}</div>})}</section> }
