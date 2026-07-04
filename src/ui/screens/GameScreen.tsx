import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { processes, processIds } from '../../data/processes'
import { recipes } from '../../data/recipes'
import { resources } from '../../data/resources'
import { technologies } from '../../data/technologies'
import { assignedWorkers, buildProcess, createInitialState, setProcessWorkers } from '../../engine/city'
import { getAdvisorMessages } from '../../engine/advisor'
import { calculateProduction } from '../../engine/production'
import { researchTechnology } from '../../engine/research'
import { deserializeGame, loadFromLocalStorage, saveToLocalStorage, serializeGame } from '../../engine/save'
import { tick } from '../../engine/tick'
import type { GameState, ProcessId, ResourceId, TechnologyId } from '../../engine/types'
import { ProcessIcon } from '../icons/ProcessIcon'
import { ResourceIcon } from '../icons/ResourceIcon'
import { Logo, NavIcon, type NavIconId } from '../icons/NavIcon'

type Mode = 'Red' | 'Procesos' | 'Logística' | 'Investigación' | 'Resiliencia' | 'Datos'
type BottomTab = 'Construir' | 'Procesos' | 'Investigación' | 'Datos' | 'Resiliencia' | 'Ayuda'
type ContextTab = 'Selección' | 'Diagnóstico' | 'Asesor' | 'Resiliencia'

const modes: Array<{ label: Mode; icon: NavIconId }> = [
  { label: 'Red', icon: 'network' },
  { label: 'Procesos', icon: 'process' },
  { label: 'Logística', icon: 'logistics' },
  { label: 'Investigación', icon: 'research' },
  { label: 'Resiliencia', icon: 'resilience' },
  { label: 'Datos', icon: 'data' },
]
const bottomTabs: Array<{ label: BottomTab; icon: NavIconId }> = [
  { label: 'Construir', icon: 'build' },
  { label: 'Procesos', icon: 'process' },
  { label: 'Investigación', icon: 'research' },
  { label: 'Datos', icon: 'data' },
  { label: 'Resiliencia', icon: 'resilience' },
  { label: 'Ayuda', icon: 'help' },
]
const tutorialSteps = [
  { title: 'Bienvenida', target: 'brand', body: 'Diseña una red productiva, optimiza recursos y estabiliza el sistema.' },
  { title: 'Recursos', target: 'resources', body: 'Arriba ves inventario, capacidad y variación por minuto. Si baja, actúa antes de agotarlo.' },
  { title: 'Red productiva', target: 'network', body: 'El centro muestra procesos como nodos y flujos como conexiones. Empiezas desde el núcleo.' },
  { title: 'Construir', target: 'build', body: 'Usa Construir para añadir Bosque, Granja, Cantera y Vivienda básica automáticamente a la red.' },
  { title: 'Trabajadores', target: 'selection', body: 'Selecciona un nodo y asigna trabajadores con +1, máximo o vaciar.' },
  { title: 'Investigación', target: 'research', body: 'Cuando generes conocimiento, investiga para abrir nuevas cadenas productivas.' },
  { title: 'Primer objetivo', target: 'next', body: 'Empieza construyendo Bosque, luego Granja y Cantera. Mantén comida y madera en positivo.' },
  { title: 'Listo', target: 'help', body: 'Ya puedes empezar a optimizar tu red. Puedes reabrir este tutorial desde Ayuda.' },
]

const format = (value: number) => (Math.abs(value) >= 100 ? Math.round(value).toString() : value.toFixed(1))
const percent = (value: number) => `${Math.round(value * 100)}%`
function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  return [h, m, s].map((part) => String(part).padStart(2, '0')).join(':')
}
function meterStyle(value: number) {
  return { '--value': `${Math.max(0, Math.min(100, value * 100))}%` } as CSSProperties
}

export function GameScreen() {
  const [state, setState] = useState<GameState>(() => loadFromLocalStorage() ?? createInitialState())
  const [mode, setMode] = useState<Mode>('Red')
  const [bottomTab, setBottomTab] = useState<BottomTab>('Construir')
  const [contextTab, setContextTab] = useState<ContextTab>('Selección')
  const [showFlowLabels, setShowFlowLabels] = useState(true)
  const [showEfficiency, setShowEfficiency] = useState(true)
  const [tutorialOpen, setTutorialOpen] = useState(() => localStorage.getItem('settlers-lab-tutorial-seen') !== 'yes')
  const [tutorialStep, setTutorialStep] = useState(0)
  const report = useMemo(() => calculateProduction(state), [state])
  const selected = state.processes.find((process) => process.uid === state.selectedProcessId) ?? state.processes[0]
  const nextAction = useMemo(() => getNextAction(state), [state])

  useEffect(() => {
    const timer = setInterval(() => setState((current) => tick(current, current.speed)), 1000)
    return () => clearInterval(timer)
  }, [])

  function addMessage(text: string, tone: GameState['messages'][number]['tone'] = 'info') {
    setState((current) => ({ ...current, messages: [{ id: crypto.randomUUID(), text, tone: tone as GameState['messages'][number]['tone'] }, ...current.messages].slice(0, 5) }))
  }
  function build(id: ProcessId) {
    setState((current) => {
      const result = buildProcess(current, id)
      if (result.error) {
        return { ...current, messages: [{ id: crypto.randomUUID(), text: result.error, tone: 'warning' as const }, ...current.messages].slice(0, 5) }
      }
      const created = result.state.processes.find((process) => process.type === id)
      return {
        ...result.state,
        selectedProcessId: created?.uid,
        messages: [{ id: crypto.randomUUID(), text: `${processes[id].name} añadido automáticamente a la red. Asigna trabajadores para activarlo.`, tone: 'success' as const }, ...result.state.messages].slice(0, 5),
      }
    })
    setBottomTab('Procesos')
    setContextTab('Selección')
  }
  function finishTutorial() {
    localStorage.setItem('settlers-lab-tutorial-seen', 'yes')
    setTutorialOpen(false)
    setTutorialStep(0)
  }
  function resetGame() {
    if (confirm('¿Iniciar una nueva simulación? Se perderán los cambios no guardados.')) {
      localStorage.removeItem('settlers-lab-tutorial-seen')
      setState(createInitialState())
      setTutorialOpen(true)
      setTutorialStep(0)
    }
  }
  function exportSave() {
    const blob = new Blob([serializeGame(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'settlers-lab-save-v0.3.0.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  function importSave(file: File) {
    if (!confirm('¿Importar este guardado y reemplazar la simulación actual?')) return
    file.text().then((raw) => setState(deserializeGame(raw))).catch(() => addMessage('No se pudo importar el guardado.', 'danger'))
  }

  return (
    <main className="control-room">
      <header className="topbar" data-tour="brand">
        <div className="brand">
          <Logo />
          <div>
            <h1>Settlers Lab</h1>
            <p>Laboratorio de optimización industrial</p>
          </div>
        </div>
        <div className="score-card" title="Índice compuesto de eficiencia, logística, trabajadores, estabilidad y resiliencia.">
          <span>Índice</span>
          <strong>{state.optimization.optimizationScore}/100</strong>
          <div className="meter"><span style={meterStyle(state.optimization.optimizationScore / 100)} /></div>
        </div>
        <div className="sim-controls">
          <button title="Pausar o reanudar la simulación" onClick={() => setState((current) => ({ ...current, paused: !current.paused }))}>{state.paused ? 'Reanudar' : 'Pausa'}</button>
          {[1, 2, 4].map((speed) => <button title={`Velocidad x${speed}`} className={state.speed === speed ? 'active' : ''} key={speed} onClick={() => setState((current) => ({ ...current, speed: speed as 1 | 2 | 4 }))}>x{speed}</button>)}
          <span>Tiempo {formatTime(state.time)}</span>
        </div>
        <div className="file-actions">
          <button title="Guardar en este navegador" onClick={() => { saveToLocalStorage(state); addMessage('Partida guardada.', 'success') }}>Guardar</button>
          <button title="Cargar guardado local" onClick={() => setState(loadFromLocalStorage() ?? state)}>Cargar</button>
          <button title="Exportar un archivo JSON" onClick={exportSave}>Exportar</button>
          <label className="buttonish" title="Importar un archivo JSON">Importar<input hidden type="file" accept="application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) importSave(file) }} /></label>
          <button title="Iniciar desde el Núcleo del sistema" onClick={resetGame}>Nueva</button>
          <button title="Reabrir tutorial y ayuda" className="help-button" onClick={() => { setTutorialOpen(true); setTutorialStep(0); setBottomTab('Ayuda') }}>?</button>
        </div>
      </header>

      <ResourceStrip state={state} />

      <section className="main-grid">
        <LeftRail mode={mode} setMode={setMode} nextAction={nextAction} tutorialOpen={tutorialOpen} tutorialStep={tutorialStep} openTutorial={() => setTutorialOpen(true)} />
        <NetworkPanel state={state} mode={mode} showEfficiency={showEfficiency} showFlowLabels={showFlowLabels} setMode={setMode} setShowEfficiency={setShowEfficiency} setShowFlowLabels={setShowFlowLabels} selectProcess={(uid) => setState((current) => ({ ...current, selectedProcessId: uid }))} />
        <ContextPanel state={state} selected={selected} contextTab={contextTab} setContextTab={setContextTab} setWorkers={(uid, workers) => setState((current) => setProcessWorkers(current, uid, workers))} />
      </section>

      <ActionDock tab={bottomTab} setTab={setBottomTab} state={state} report={report} build={build} research={(id) => setState((current) => researchTechnology(current, id))} selectProcess={(uid) => setState((current) => ({ ...current, selectedProcessId: uid }))} openTutorial={() => { setTutorialOpen(true); setTutorialStep(0) }} />

      <section className="toast-row" aria-live="polite">
        {state.messages.map((message) => <span className={message.tone} key={message.id}>{message.text}</span>)}
      </section>

      {tutorialOpen && <TutorialOverlay step={tutorialStep} setStep={setTutorialStep} close={finishTutorial} />}
    </main>
  )
}

function ResourceStrip({ state }: { state: GameState }) {
  return (
    <section className="resource-strip" data-tour="resources">
      {(Object.keys(state.resources) as ResourceId[]).filter((id) => state.resources[id].visible).map((id) => {
        const resource = state.resources[id]
        const net = resource.producedPerMinute - resource.consumedPerMinute
        const fill = resource.capacity > 0 ? resource.amount / resource.capacity : 1
        const status = state.optimization.limitingResource === id ? 'limiting' : net < 0 ? 'deficit' : fill < 0.12 ? 'critical' : 'stable'
        return (
          <article className={`resource-card ${status}`} key={id} title="Inventario, capacidad y producción neta por minuto.">
            <ResourceIcon id={id} />
            <div className="resource-copy">
              <strong>{resources[id].name}</strong>
              <span>{format(resource.amount)} / {format(resource.capacity)}</span>
              <small>{net >= 0 ? '+' : ''}{format(net)}/min</small>
            </div>
            <div className="meter"><span style={meterStyle(fill)} /></div>
          </article>
        )
      })}
    </section>
  )
}

function LeftRail({ mode, setMode, nextAction, tutorialOpen, tutorialStep, openTutorial }: { mode: Mode; setMode: (mode: Mode) => void; nextAction: ReturnType<typeof getNextAction>; tutorialOpen: boolean; tutorialStep: number; openTutorial: () => void }) {
  return (
    <aside className="left-rail" data-tour="next">
      <nav className="mode-nav">
        {modes.map((item) => <button title={`Cambiar a modo ${item.label}`} className={mode === item.label ? 'active' : ''} key={item.label} onClick={() => setMode(item.label)}><NavIcon id={item.icon} />{item.label}</button>)}
      </nav>
      <section className="next-card">
        <p className="eyebrow">Qué hacer ahora</p>
        <h2>{nextAction.title}</h2>
        <p>{nextAction.reason}</p>
        <div className="meter"><span style={meterStyle(nextAction.progress)} /></div>
        <small>Progreso: {percent(nextAction.progress)}</small>
      </section>
      <section className="mini-help">
        <button title="Abrir tutorial paso a paso" onClick={openTutorial}><NavIcon id="help" />Tutorial</button>
        <p>{tutorialOpen ? `Tutorial activo: ${tutorialSteps[tutorialStep]?.title}` : 'Ayuda disponible en cualquier momento.'}</p>
      </section>
    </aside>
  )
}

function NetworkPanel({ state, mode, showEfficiency, showFlowLabels, setMode, setShowEfficiency, setShowFlowLabels, selectProcess }: { state: GameState; mode: Mode; showEfficiency: boolean; showFlowLabels: boolean; setMode: (mode: Mode) => void; setShowEfficiency: (value: boolean) => void; setShowFlowLabels: (value: boolean) => void; selectProcess: (uid: string) => void }) {
  const builtTypes = new Set(state.processes.map((process) => process.type))
  return (
    <section className="network-panel" data-tour="network">
      <div className="panel-toolbar">
        <div>
          <strong>Red productiva</strong>
          <span>Modo {mode}</span>
        </div>
        <button title="Centrar visualmente la red" onClick={() => setMode('Red')}>Centrar</button>
        <button title="Ajustar red a la vista disponible" onClick={() => setMode('Red')}>Ajustar</button>
        <button title="Mostrar u ocultar etiquetas de flujo" onClick={() => setShowFlowLabels(!showFlowLabels)}>{showFlowLabels ? 'Ocultar flujos' : 'Ver flujos'}</button>
        <button title="Mostrar u ocultar eficiencia de cada nodo" onClick={() => setShowEfficiency(!showEfficiency)}>{showEfficiency ? 'Ocultar eficiencia' : 'Ver eficiencia'}</button>
        <button title="Resaltar conexiones con baja eficiencia" onClick={() => setMode('Logística')}>Cuellos</button>
      </div>
      <svg className="network-canvas" viewBox="0 0 1000 620" role="img" aria-label="Red productiva abstracta">
        {state.connections.filter((connection) => builtTypes.has(connection.from) && builtTypes.has(connection.to)).map((connection) => {
          const from = processes[connection.from].position
          const to = processes[connection.to].position
          const flowColor = connection.efficiency < 0.55 ? '#d97706' : connection.efficiency > 0.82 ? '#3589d6' : '#4fa66a'
          return (
            <g key={connection.id}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={flowColor} strokeWidth={2.5 + connection.weight * 3} strokeLinecap="round" opacity="0.72" />
              {showFlowLabels && <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} fill={flowColor} fontSize="15" textAnchor="middle">{resources[connection.resource].name} · {connection.capacityPerMinute}/min · {Math.round(connection.weight * 100)}%</text>}
            </g>
          )
        })}
        {state.processes.map((process) => {
          const definition = processes[process.type]
          const hasIssue = process.status !== 'Funcionando'
          return (
            <g className="node" key={process.uid} onClick={() => selectProcess(process.uid)} transform={`translate(${definition.position.x - 78} ${Math.min(definition.position.y, 560) - 46})`}>
              <rect width="156" height="92" rx="16" fill="#ffffff" stroke={hasIssue ? '#d97706' : '#87acd8'} strokeWidth="2" />
              <foreignObject x="10" y="10" width="34" height="34"><ProcessIcon id={process.type} /></foreignObject>
              <text x="50" y="28" fill="#263241" fontSize="16" fontWeight="700">{definition.name}</text>
              <text x="12" y="56" fill="#536272" fontSize="13">{process.workers}/{definition.maxWorkers} trabajadores</text>
              {showEfficiency && <text x="12" y="76" fill={hasIssue ? '#b45309' : '#2f7a4b'} fontSize="13">{percent(process.efficiency)} · {process.status}</text>}
            </g>
          )
        })}
      </svg>
      {state.processes.length === 1 && <div className="empty-network">Empieza desde el Núcleo del sistema. Abre <strong>Construir</strong> y añade un Bosque.</div>}
    </section>
  )
}

function ContextPanel({ state, selected, contextTab, setContextTab, setWorkers }: { state: GameState; selected?: GameState['processes'][number]; contextTab: ContextTab; setContextTab: (tab: ContextTab) => void; setWorkers: (uid: string, workers: number) => void }) {
  const advisor = getAdvisorMessages(state)
  return (
    <aside className="context-panel" data-tour="selection">
      <nav className="context-tabs">
        {(['Selección', 'Diagnóstico', 'Asesor', 'Resiliencia'] as ContextTab[]).map((tab) => <button title={`Ver ${tab.toLowerCase()}`} className={contextTab === tab ? 'active' : ''} key={tab} onClick={() => setContextTab(tab)}>{tab}</button>)}
      </nav>
      {contextTab === 'Selección' && <SelectedNode selected={selected} setWorkers={setWorkers} />}
      {contextTab === 'Diagnóstico' && <DiagnosticPanel state={state} />}
      {contextTab === 'Asesor' && <AdvisorPanel messages={advisor} mainLoss={state.optimization.mainLoss} />}
      {contextTab === 'Resiliencia' && <ResilienceSummary state={state} />}
    </aside>
  )
}

function SelectedNode({ selected, setWorkers }: { selected?: GameState['processes'][number]; setWorkers: (uid: string, workers: number) => void }) {
  if (!selected) return <EmptyState title="Sin nodo seleccionado" body="Pulsa un nodo de la red para ver receta, eficiencia y trabajadores." />
  const definition = processes[selected.type]
  const recipe = definition.recipeId ? recipes[definition.recipeId] : undefined
  return (
    <section className="selected-node">
      <div className="node-title"><ProcessIcon id={selected.type} /><div><p className="eyebrow">Nodo seleccionado</p><h2>{definition.name}</h2></div></div>
      <Badge tone={selected.status === 'Funcionando' ? 'good' : 'warn'}>{selected.status}</Badge>
      <Metric label="Eficiencia" value={percent(selected.efficiency)} meter={selected.efficiency} />
      <Metric label="Logística" value={percent(selected.logisticsEfficiency)} meter={selected.logisticsEfficiency} />
      <Metric label="Trabajadores" value={`${selected.workers}/${definition.maxWorkers}`} meter={definition.maxWorkers ? selected.workers / definition.maxWorkers : 1} />
      {recipe && <p className="recipe-line">{formatRecipe(recipe.inputs)} → {formatRecipe(recipe.outputs)} · ciclo {recipe.cycleSeconds}s</p>}
      <p className="small-note">{selected.stopReason ?? definition.description}</p>
      {definition.maxWorkers > 0 && <div className="worker-actions"><button title="Quitar un trabajador" onClick={() => setWorkers(selected.uid, selected.workers - 1)}>-1</button><button title="Asignar un trabajador" className="primary" onClick={() => setWorkers(selected.uid, selected.workers + 1)}>+1 trabajador</button><button title="Llenar hasta el máximo" onClick={() => setWorkers(selected.uid, definition.maxWorkers)}>Máximo</button><button title="Vaciar trabajadores" onClick={() => setWorkers(selected.uid, 0)}>Vaciar</button></div>}
    </section>
  )
}

function DiagnosticPanel({ state }: { state: GameState }) {
  return (
    <section className="diagnostic-card">
      <p className="eyebrow">Problema principal</p>
      <h2>{state.optimization.mainLoss}</h2>
      <Metric label="Uso de trabajadores" value={`${assignedWorkers(state)}/${Math.floor(state.resources.population.amount)}`} meter={state.optimization.workerUtilization} />
      <Metric label="Logística media" value={percent(state.optimization.logisticsEfficiency)} meter={state.optimization.logisticsEfficiency} />
      <Metric label="Procesos activos" value={percent(state.optimization.activeProcessRatio)} meter={state.optimization.activeProcessRatio} />
      <p className="small-note">Recurso limitante: {state.optimization.limitingResource ? resources[state.optimization.limitingResource].name : 'ninguno detectado'}</p>
    </section>
  )
}

function AdvisorPanel({ messages, mainLoss }: { messages: string[]; mainLoss: string }) {
  const recommendation = messages[0] ?? 'El sistema está estable. Expande con cuidado.'
  return (
    <section className="advisor-card">
      <p className="eyebrow">Asesor</p>
      <h2>{recommendation}</h2>
      <p><strong>Motivo:</strong> {mainLoss}</p>
      <p><strong>Impacto esperado:</strong> mejora del recurso limitante o recuperación de eficiencia.</p>
      {messages.slice(1, 3).map((message) => <p className="small-note" key={message}>{message}</p>)}
    </section>
  )
}

function ResilienceSummary({ state }: { state: GameState }) {
  const next = state.perturbations[0]
  return (
    <section className="resilience-card">
      <p className="eyebrow">Resiliencia</p>
      <Metric label="Reserva operativa" value={`${format(state.resources.resilience.amount)}/${format(state.resources.resilience.capacity)}`} meter={state.resources.resilience.amount / Math.max(1, state.resources.resilience.capacity)} />
      {next ? <><h2>{next.name}</h2><p>Intensidad {next.intensity} · llega en {Math.max(0, Math.round(next.secondsUntil))}s</p><p className="small-note">Impacto probable: pérdida de recursos o caída temporal de eficiencia si no hay reservas.</p></> : <EmptyState title="Sin perturbaciones próximas" body="Mantén reservas para contratos futuros." />}
    </section>
  )
}

function ActionDock({ tab, setTab, state, report, build, research, selectProcess, openTutorial }: { tab: BottomTab; setTab: (tab: BottomTab) => void; state: GameState; report: ReturnType<typeof calculateProduction>; build: (id: ProcessId) => void; research: (id: TechnologyId) => void; selectProcess: (uid: string) => void; openTutorial: () => void }) {
  return (
    <section className="action-dock" data-tour="build">
      <nav className="dock-tabs">
        {bottomTabs.map((item) => <button title={`Abrir ${item.label}`} className={tab === item.label ? 'active' : ''} key={item.label} onClick={() => setTab(item.label)}><NavIcon id={item.icon} />{item.label}</button>)}
      </nav>
      <div className="dock-content">
        {tab === 'Construir' && <BuildCatalog state={state} build={build} />}
        {tab === 'Procesos' && <ProcessList state={state} selectProcess={selectProcess} />}
        {tab === 'Investigación' && <ResearchList state={state} research={research} />}
        {tab === 'Datos' && <DataPanel state={state} report={report} />}
        {tab === 'Resiliencia' && <ResilienceSummary state={state} />}
        {tab === 'Ayuda' && <HelpPanel openTutorial={openTutorial} />}
      </div>
    </section>
  )
}

function BuildCatalog({ state, build }: { state: GameState; build: (id: ProcessId) => void }) {
  const starter: ProcessId[] = ['forest', 'farm', 'quarry', 'basicHousing']
  const visible = processIds.filter((id) => id !== 'townCenter' && (starter.includes(id) || state.researched.includes(processes[id].unlockedBy as TechnologyId) || state.processes.some((process) => process.type === id)))
  return (
    <div className="build-grid">
      {visible.map((id) => {
        const definition = processes[id]
        const built = state.processes.some((process) => process.type === id)
        const locked = Boolean(definition.unlockedBy && !state.researched.includes(definition.unlockedBy))
        const affordable = Object.entries(definition.buildCost).every(([resource, amount]) => state.resources[resource as ResourceId].amount >= amount)
        return (
          <article className={`build-card ${locked ? 'locked' : ''}`} key={id}>
            <ProcessIcon id={id} />
            <div>
              <h3>{definition.name}</h3>
              <p>{definition.description}</p>
              <small>Coste: {formatCost(definition.buildCost)} · trabajadores {definition.maxWorkers}</small>
            </div>
            <button title={locked ? `Requiere ${definition.unlockedBy}` : `Añadir ${definition.name} automáticamente a la red`} disabled={built || locked || !affordable} onClick={() => build(id)}>{built ? 'En la red' : locked ? `Bloqueado` : affordable ? 'Construir' : 'Sin recursos'}</button>
          </article>
        )
      })}
    </div>
  )
}

function ProcessList({ state, selectProcess }: { state: GameState; selectProcess: (uid: string) => void }) {
  return <div className="compact-list">{state.processes.map((process) => <button title="Seleccionar este nodo" key={process.uid} onClick={() => selectProcess(process.uid)}><ProcessIcon id={process.type} /><strong>{processes[process.type].name}</strong><span>{process.status}</span><span>{process.workers}/{processes[process.type].maxWorkers}</span></button>)}</div>
}

function ResearchList({ state, research }: { state: GameState; research: (id: TechnologyId) => void }) {
  const visible = technologies.filter((tech) => state.researched.includes(tech.id) || (tech.prerequisites ?? []).every((id) => state.researched.includes(id)))
  if (!visible.length) return <EmptyState title="Sin tecnologías visibles" body="Construye una Escuela para generar conocimiento y abrir investigación." />
  return <div className="research-grid">{visible.map((tech) => { const cost = Object.entries(tech.cost); const canPay = cost.every(([resource, amount]) => state.resources[resource as ResourceId].amount >= amount); const completed = state.researched.includes(tech.id); return <article className="tech-card" key={tech.id}><p className="eyebrow">{tech.branch}</p><h3>{tech.name}</h3><p>{tech.description}</p><small>Coste: {formatCost(tech.cost)}</small><small>Desbloquea: {tech.unlocks?.map((unlock) => resources[unlock as ResourceId]?.name ?? processes[unlock as ProcessId]?.name ?? unlock).join(', ') || tech.effects.join(', ')}</small><div className="meter"><span style={meterStyle(cost.length ? Math.min(1, cost.reduce((sum, [resource, amount]) => sum + state.resources[resource as ResourceId].amount / amount, 0) / cost.length) : 1)} /></div><button title="Investigar esta tecnología" disabled={completed || !canPay} onClick={() => research(tech.id)}>{completed ? 'Investigada' : canPay ? 'Investigar' : 'Faltan recursos'}</button></article> })}</div>
}

function DataPanel({ state, report }: { state: GameState; report: ReturnType<typeof calculateProduction> }) {
  return <div className="data-grid"><Metric label="Índice" value={`${state.optimization.optimizationScore}/100`} meter={state.optimization.optimizationScore / 100} /><Metric label="Eficiencia" value={percent(state.optimization.processEfficiency)} meter={state.optimization.processEfficiency} /><Metric label="Trabajadores" value={percent(state.optimization.workerUtilization)} meter={state.optimization.workerUtilization} /><Metric label="Resiliencia" value={percent(state.optimization.resilienceScore)} meter={state.optimization.resilienceScore} /><p>Neto madera: {format(report.netPerMinute.wood ?? 0)}/min</p><p>Neto comida: {format(report.netPerMinute.food ?? 0)}/min</p><svg viewBox="0 0 260 70" className="sparkline">{state.history.map((point, index) => <circle key={`${point.time}-${index}`} cx={index * 2.2} cy={68 - point.optimizationScore * 0.62} r="1.8" />)}</svg></div>
}

function HelpPanel({ openTutorial }: { openTutorial: () => void }) {
  return <div className="help-panel"><button className="primary" onClick={openTutorial}><NavIcon id="help" />Reabrir tutorial</button><p><strong>Conceptos básicos:</strong> recursos = estado, procesos = nodos, flujos = conexiones, trabajadores = capacidad limitada, resiliencia = absorción de perturbaciones.</p><p><strong>Primeros pasos:</strong> construye Bosque, asigna trabajador, añade Granja y Cantera, estabiliza recursos y desbloquea investigación.</p></div>
}

function TutorialOverlay({ step, setStep, close }: { step: number; setStep: (step: number) => void; close: () => void }) {
  const current = tutorialSteps[step]
  return (
    <div className="tutorial-layer" data-target={current.target}>
      <div className="tutorial-popover">
        <p className="eyebrow">Tutorial {step + 1}/{tutorialSteps.length}</p>
        <h2>{current.title}</h2>
        <p>{current.body}</p>
        <div className="tutorial-actions"><button onClick={close}>Saltar</button><button disabled={step === 0} onClick={() => setStep(step - 1)}>Atrás</button>{step === tutorialSteps.length - 1 ? <button className="primary" onClick={close}>Empezar</button> : <button className="primary" onClick={() => setStep(step + 1)}>Siguiente</button>}</div>
      </div>
    </div>
  )
}

function Metric({ label, value, meter }: { label: string; value: string; meter: number }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><div className="meter"><span style={meterStyle(meter)} /></div></div>
}
function Badge({ tone, children }: { tone: 'good' | 'warn'; children: ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>
}
function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="empty-state"><strong>{title}</strong><p>{body}</p></div>
}
function formatRecipe(entries: Partial<Record<ResourceId, number>>) {
  const parts = Object.entries(entries) as [ResourceId, number][]
  return parts.length ? parts.map(([resource, amount]) => `${amount} ${resources[resource].name}`).join(' + ') : 'sin entradas'
}
function formatCost(cost: Partial<Record<ResourceId, number>>) {
  const parts = Object.entries(cost) as [ResourceId, number][]
  return parts.length ? parts.map(([resource, amount]) => `${amount} ${resources[resource].name}`).join(', ') : 'sin coste'
}
function getNextAction(state: GameState) {
  const has = (id: ProcessId) => state.processes.some((process) => process.type === id)
  if (!has('forest')) return { title: 'Construye un Bosque', reason: 'Necesitas producción de madera para activar el resto de la red.', progress: 0.1 }
  if (state.processes.find((process) => process.type === 'forest')?.workers === 0) return { title: 'Asigna 1 trabajador al Bosque', reason: 'Un nodo sin trabajadores no aporta producción útil.', progress: 0.22 }
  if (!has('farm')) return { title: 'Construye una Granja', reason: 'La comida sostiene población, escuela y cadenas posteriores.', progress: 0.36 }
  if (!has('quarry')) return { title: 'Construye una Cantera', reason: 'La piedra abre almacén, vivienda e industria refinada.', progress: 0.5 }
  if (!has('basicHousing')) return { title: 'Construye Vivienda básica', reason: 'Más población significa más trabajadores para optimizar.', progress: 0.64 }
  if ((state.resources.knowledge.producedPerMinute - state.resources.knowledge.consumedPerMinute) <= 0) return { title: 'Prepara conocimiento', reason: 'Construye Escuela cuando puedas para desbloquear Carpintería básica.', progress: 0.76 }
  if (!state.researched.includes('basic_carpentry')) return { title: 'Investiga Carpintería básica', reason: 'Desbloquea Aserradero y Tablones, la primera cadena refinada.', progress: 0.88 }
  return { title: 'Optimiza el cuello de botella', reason: state.optimization.mainLoss, progress: Math.min(1, state.optimization.optimizationScore / 100) }
}
