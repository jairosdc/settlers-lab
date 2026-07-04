export const technologies = [
    { id: 'logisticsI', name: 'Logística I', description: 'Carreteras conectadas aportan +8% de eficiencia.', cost: [{ resource: 'knowledge', amount: 18 }] },
    { id: 'industrialPlanning', name: 'Planificación industrial', description: 'Desbloquea taller, laboratorio y asesor avanzado.', cost: [{ resource: 'knowledge', amount: 45 }], prerequisites: ['logisticsI'] },
    { id: 'metalwork', name: 'Metalurgia', description: 'Desbloquea mineral, metal, mina y fundición.', cost: [{ resource: 'knowledge', amount: 85 }, { resource: 'tools', amount: 10 }], prerequisites: ['industrialPlanning'] },
    { id: 'urbanExpansion', name: 'Expansión urbana', description: 'Amplía la cuadrícula virtual.', cost: [{ resource: 'knowledge', amount: 55 }, { resource: 'planks', amount: 25 }] },
    { id: 'relocation', name: 'Grúas de relocalización', description: 'Permite mover edificios no centrales.', cost: [{ resource: 'knowledge', amount: 70 }, { resource: 'tools', amount: 15 }], prerequisites: ['industrialPlanning'] },
    { id: 'tactics', name: 'Tácticas defensivas', description: 'Los soldados cuentan más contra amenazas.', cost: [{ resource: 'knowledge', amount: 60 }, { resource: 'tools', amount: 8 }] },
];
