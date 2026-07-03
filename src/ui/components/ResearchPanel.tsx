import { technologies } from '../../data/technologies'
import type { GameState } from '../../engine/types'
export function ResearchPanel({ state }: { state: GameState }) { return <section className="panel"><h2>Investigación</h2><p>Nivel asesor: {state.advisorLevel}</p>{technologies.map(t=><p key={t.level} className={state.advisorLevel>=t.level?'done':''}>{t.name}: {t.knowledge} conocimiento</p>)}</section> }
