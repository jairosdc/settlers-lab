// @ts-nocheck
import { buildingDefinitions } from '../../data/buildings'
import type { BuildingInstance } from '../../engine/types'
import { GameIcon } from './icons/GameIcon'
export function Tile({ building, selected, onClick }: { building?: BuildingInstance; selected: boolean; onClick:()=>void }) { const def=building?buildingDefinitions[building.type]:undefined; return <button className={`tile ${selected?'selected':''} ${building?.connected===false?'disconnected':''}`} onClick={onClick} title={def?.name??'Vacío'}>{def&&<GameIcon id={def.icon}/>}<small>{building&&building.type!=='road'&&building.type!=='townCenter'?`${Math.round(building.efficiency*100)}%`:''}</small></button> }
