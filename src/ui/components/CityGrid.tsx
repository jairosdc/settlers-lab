import { getBuildingAt } from '../../engine/city'
import type { GameState } from '../../engine/types'
import { Tile } from './Tile'
export function CityGrid({ state, onTile }: { state: GameState; onTile:(x:number,y:number)=>void }) { const cells=[]; for(let y=0;y<state.height;y++) for(let x=0;x<state.width;x++) cells.push(<Tile key={`${x},${y}`} building={getBuildingAt(state,x,y)} selected={state.selectedTile?.x===x&&state.selectedTile.y===y} onClick={()=>onTile(x,y)} />); return <section className="grid" style={{gridTemplateColumns:`repeat(${state.width}, 42px)`}}>{cells}</section> }
