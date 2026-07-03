import { useEffect, useState } from 'react'
import { buildAt, createInitialState } from '../../engine/city'
import { saveToLocalStorage, loadFromLocalStorage, serializeGame, deserializeGame } from '../../engine/save'
import { tick } from '../../engine/tick'
import { changeWorkers } from '../../engine/workers'
import type { BuildingId, GameState } from '../../engine/types'
import { ResourceBar } from '../components/ResourceBar'
import { TopBar } from '../components/TopBar'
import { CityGrid } from '../components/CityGrid'
import { BuildMenu } from '../components/BuildMenu'
import { BuildingPanel } from '../components/BuildingPanel'
import { WorkerPanel } from '../components/WorkerPanel'
import { ObjectivePanel } from '../components/ObjectivePanel'
import { ResearchPanel } from '../components/ResearchPanel'
import { ThreatPanel } from '../components/ThreatPanel'
import { AdvisorPanel } from '../components/AdvisorPanel'

export function GameScreen() {
 const [state,setState]=useState<GameState>(()=>loadFromLocalStorage() ?? createInitialState())
 useEffect(()=>{ const id=setInterval(()=>setState(s=>tick(s, s.speed)),1000); return ()=>clearInterval(id) },[])
 useEffect(()=>{ const id=setInterval(()=>saveToLocalStorage(state),5000); return ()=>clearInterval(id) },[state])
 const message=(text:string, tone: 'info'|'success'|'warning'|'danger'='info')=>setState(s=>({...s,messages:[{id:crypto.randomUUID(),text,tone},...s.messages].slice(0,6)}))
 const onTile=(x:number,y:number)=>setState(s=>{ if(s.selectedBuildingToBuild){ const result=buildAt(s,s.selectedBuildingToBuild,x,y); if(result.error){ return {...s, selectedTile:{x,y}, messages:[{id:crypto.randomUUID(), text:result.error, tone:'warning' as const},...s.messages].slice(0,6)} } return {...result.state, selectedTile:{x,y}, selectedBuildingToBuild: undefined, messages:[{id:crypto.randomUUID(), text:'Construcción completada.', tone:'success' as const},...result.state.messages].slice(0,6)} } return {...s, selectedTile:{x,y}} })
 const exportSave=()=>{ const blob=new Blob([serializeGame(state)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='settlers-lab-save.json'; a.click(); URL.revokeObjectURL(url) }
 const importSave=(file:File)=>{ file.text().then(raw=>{ setState(deserializeGame(raw)); message('Partida importada.', 'success') }).catch(()=>message('No se pudo importar el JSON.', 'danger')) }
 return <main><TopBar state={state} onPause={()=>setState(s=>({...s,paused:!s.paused}))} onSpeed={(speed)=>setState(s=>({...s,speed}))} onSave={()=>{saveToLocalStorage(state); message('Partida guardada.', 'success')}} onLoad={()=>setState(loadFromLocalStorage() ?? state)} onReset={()=>setState(createInitialState())} onExport={exportSave} onImport={importSave}/><ResourceBar state={state}/><section className="messages">{state.messages.map(m=><span className={m.tone} key={m.id}>{m.text}</span>)}</section><div className="layout"><div><CityGrid state={state} onTile={onTile}/><BuildingPanel state={state}/></div><div className="side"><BuildMenu state={state} onSelect={(id:BuildingId)=>setState(s=>({...s,selectedBuildingToBuild:id}))}/><WorkerPanel state={state} onChange={(uid,delta)=>setState(s=>changeWorkers(s,uid,delta))}/></div><div className="side"><ObjectivePanel state={state}/><ResearchPanel state={state}/><ThreatPanel state={state}/><AdvisorPanel state={state}/></div></div></main>
}
