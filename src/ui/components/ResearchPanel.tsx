// @ts-nocheck
import { technologies } from '../../data/technologies'
import { canResearch } from '../../engine/research'
import type { GameState, TechnologyId } from '../../engine/types'
export function ResearchPanel({ state, onResearch, onExpand }: { state: GameState; onResearch:(id:TechnologyId)=>void; onExpand:()=>void }) { return <section className="panel"><h2>Conocimiento</h2><p>Nivel asesor: {state.advisorLevel}</p>{technologies.map(t=><div key={t.id} className={state.researched.includes(t.id)?'done objective':'objective'}><strong>{t.name}</strong><small>{t.description}</small><small>Coste: {t.cost.map(c=>`${c.amount} ${c.resource}`).join(' · ')}</small><button disabled={!canResearch(state,t.id)} onClick={()=>onResearch(t.id)}>{state.researched.includes(t.id)?'Investigado':'Investigar'}</button></div>)}<button disabled={!state.researched.includes('urbanExpansion')} onClick={onExpand}>Ampliar cuadrícula</button></section> }
