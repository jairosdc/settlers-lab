# Settlers Lab

Settlers Lab es un MVP web de simulación incremental/city-builder en español. El jugador construye una pequeña ciudad industrial temprana, asigna trabajadores, conecta edificios con caminos, gestiona recursos y sobrevive a amenazas de bandidos.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Para compilar producción:

```bash
npm run build
```

## Estructura

- `src/engine/`: lógica pura del juego: ciudad, producción, trabajadores, investigación, amenazas, guardado y tick.
- `src/data/`: definiciones declarativas de recursos, edificios, objetivos y tecnologías.
- `src/ui/components/`: paneles reutilizables de interfaz.
- `src/ui/screens/GameScreen.tsx`: composición de la pantalla principal y persistencia local.

## Mecánicas actuales

- Cuadrícula 10x10 con centro urbano inicial.
- Edificios: casa, campamento maderero, granja, cantera, escuela, almacén, cuartel, muralla y camino.
- Producción automática por tick, consumo, capacidad y tasas netas por minuto.
- Caminos como red logística: edificios conectados producen al 100%, desconectados al 60%.
- Trabajadores asignables a edificios productivos.
- Objetivos iniciales y condición de fin del MVP.
- Investigación con asesor nivel 0, diagnóstico básico y recomendador simple.
- Amenazas de bandidos con cuenta atrás y resolución por defensa.
- Autoguardado en `localStorage`, guardado/carga manual, reinicio, exportación e importación JSON versionada (`0.1.0`).

## Controles

1. Selecciona un edificio en el panel de construcción.
2. Pulsa una celda vacía de la cuadrícula para construir si tienes recursos suficientes.
3. Asigna trabajadores con los botones `+` y `-`.
4. Usa caminos para conectar edificios al centro urbano.
5. Mantén comida positiva y prepara defensa para los ataques.

## Roadmap

- Tests Vitest para motor puro.
- Gráficas de producción y cuellos de botella.
- Grafo logístico ponderado y costes de transporte.
- Optimizador de trabajadores sugerido, no automático.
- Eventos y cadenas productivas más profundas.
- Despliegue en GitHub Pages: configurar `base` en `vite.config.ts`, publicar `dist/` con GitHub Actions o `gh-pages`.
