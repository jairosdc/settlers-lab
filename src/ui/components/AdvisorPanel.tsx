import { getAdvisorMessages } from '../../engine/advisor'
import type { GameState } from '../../engine/types'
export function AdvisorPanel({ state }: { state: GameState }) { return <section className="panel"><h2>Asesor</h2>{getAdvisorMessages(state).map((m,i)=><p key={i}>{m}</p>)}</section> }
