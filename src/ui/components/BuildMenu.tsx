import { buildingDefinitions } from '../../data/buildings'
import type { BuildingId, GameState } from '../../engine/types'
const buildables: BuildingId[] = ['house','lumberCamp','farm','quarry','school','warehouse','barracks','wall','road']
export function BuildMenu({ state, onSelect }: { state: GameState; onSelect:(id:BuildingId)=>void }) { return <section className="panel"><h2>Construcción</h2>{buildables.map((id)=>{ const d=buildingDefinitions[id]; return <button key={id} className={state.selectedBuildingToBuild===id?'active build':'build'} onClick={()=>onSelect(id)}><span>{d.icon} {d.name}</span><small>{d.cost.map(c=>`${c.amount} ${c.resource}`).join(' · ') || 'Gratis'}</small></button> })}</section> }
