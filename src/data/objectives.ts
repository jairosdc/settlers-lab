import type { Objective } from '../engine/types'
export function initialObjectives(): Objective[] { return [
 {id:'plank-chain',kind:'hito',title:'Primera cadena estable de tablones',description:'Consigue producción neta positiva de tablones.',completed:false,reward:'Conocimiento y horizonte refinado'},
 {id:'first-bottleneck',kind:'hito',title:'Primer cuello de botella resuelto',description:'Reduce los cuellos de botella activos a cero.',completed:false},
 {id:'opt70',kind:'contrato',title:'Contrato: índice 70',description:'Mantén un índice de optimización superior a 70.',completed:false,reward:'+20 conocimiento'},
 {id:'logistics80',kind:'contrato',title:'Contrato: logística 80%',description:'Alcanza 80% de eficiencia logística media.',completed:false},
 {id:'resilience50',kind:'dinamico',title:'Objetivo sugerido: resiliencia operativa',description:'Sube la resiliencia por encima de 50.',completed:false},
 {id:'horizon2',kind:'horizonte',title:'Horizonte II: Producción refinada',description:'Desbloquea tablones, ladrillos o pan. La simulación continúa.',completed:false},
] }
