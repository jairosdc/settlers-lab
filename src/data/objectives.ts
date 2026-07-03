import type { Objective } from '../engine/types'
export function initialObjectives(): Objective[] { return [
 { id:'two-houses', title:'Construye 2 casas', description:'Da techo a nuevos habitantes.', completed:false },
 { id:'ten-pop', title:'Alcanza 10 habitantes', description:'La ciudad empieza a crecer.', completed:false },
 { id:'positive-food', title:'Comida neta positiva', description:'Evita hambrunas tempranas.', completed:false },
 { id:'quarry', title:'Construye una cantera', description:'Necesitas piedra estable.', completed:false },
 { id:'school', title:'Construye una escuela', description:'Abre la vía del conocimiento.', completed:false },
 { id:'knowledge-20', title:'Genera 20 conocimiento', description:'Primeros análisis de datos.', completed:false },
 { id:'advisor-1', title:'Desbloquea asesor básico', description:'Diagnósticos automáticos.', completed:false },
 { id:'barracks', title:'Construye un cuartel', description:'Prepara defensa activa.', completed:false },
 { id:'wall', title:'Construye una muralla', description:'Defensa pasiva ante bandidos.', completed:false },
 { id:'first-attack', title:'Sobrevive al primer ataque', description:'La ciudad debe resistir.', completed:false },
] }
