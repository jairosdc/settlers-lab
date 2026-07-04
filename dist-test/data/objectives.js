export function initialObjectives() {
    return [
        { id: 'stable-food', title: 'Balance alimentario positivo', description: 'La comida neta debe ser mayor que cero.', completed: false },
        { id: 'sawmill', title: 'Construye un aserradero', description: 'Inicia la cadena madera → tablones.', completed: false },
        { id: 'planks', title: 'Acumula 20 tablones', description: 'Primer inventario intermedio.', completed: false },
        { id: 'logistics', title: 'Investiga Logística I', description: 'Las carreteras conectadas aumentan eficiencia.', completed: false },
        { id: 'tools', title: 'Produce 5 herramientas', description: 'Habilita cadenas industriales más complejas.', completed: false },
        { id: 'industrial', title: 'Planificación industrial', description: 'Desbloquea optimización avanzada.', completed: false },
        { id: 'soldiers', title: 'Entrena 3 soldados', description: 'Separa defensa activa de murallas.', completed: false },
        { id: 'attack', title: 'Sobrevive una amenaza', description: 'Valida tu resiliencia.', completed: false },
        { id: 'metal', title: 'Produce 5 metal', description: 'Cierra la primera cadena industrial completa.', completed: false },
    ];
}
