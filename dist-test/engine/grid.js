export function expandGrid(state) { if (!state.researched.includes('urbanExpansion'))
    return state; return { ...state, width: state.width + 4, height: state.height + 3, messages: [{ id: crypto.randomUUID(), text: 'Cuadrícula ampliada para el siguiente bloque industrial.', tone: 'success' }, ...state.messages].slice(0, 6) }; }
