# Settlers Lab

**Settlers Lab** es un laboratorio jugable de optimización industrial. El jugador no decora una ciudad: diseña, expande y optimiza una red productiva abstracta bajo restricciones de recursos, trabajadores, logística, investigación, resiliencia y perturbaciones externas.

## Nueva identidad

La pantalla principal es una **red productiva**. Los recursos son el estado del sistema, los procesos son nodos, las conexiones son flujos logísticos y los trabajadores son capacidad operativa limitada. La investigación abre nuevas cadenas, herramientas de análisis y mejoras de resiliencia. El asesor no usa IA generativa: aplica reglas sobre métricas reales para detectar recursos limitantes, procesos parados y cuellos de botella.

> Settlers Lab no es un city-builder decorativo: es un laboratorio jugable de optimización industrial basado en redes, flujos, restricciones, resiliencia y eficiencia.

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Compilar y probar

```bash
npm run build
npm run test
```

## Cómo jugar

1. Observa la barra de recursos: cada tarjeta muestra stock, capacidad, producción neta por minuto y agotamiento estimado si el flujo es negativo.
2. Usa la red central para localizar procesos parados, nodos con baja eficiencia y flujos naranjas.
3. Asigna trabajadores manualmente en el panel del nodo seleccionado.
4. Investiga tecnologías para desbloquear procesos, recursos y diagnósticos.
5. Revisa Logística, Pesos y Datos para entender el sistema antes de expandirlo.
6. Sube el índice de optimización resolviendo el recurso limitante, estabilizando inventarios y preparando resiliencia.

## Sistemas principales

### Recursos

Recursos iniciales: madera, piedra, comida, población, conocimiento y resiliencia. Recursos desbloqueables: tablones, ladrillos, metal, pan, herramientas y energía futura. Cada recurso tiene definición declarativa en `src/data/resources.ts`.

### Procesos y recetas

Los procesos se definen de forma data-driven en `src/data/processes.ts` y sus recetas en `src/data/recipes.ts`. Las cadenas mínimas incluidas son:

- Bosque → Madera
- Madera → Aserradero → Tablones
- Cantera → Piedra
- Piedra + Madera → Ladrillar → Ladrillos
- Granja → Comida
- Comida → Panadería → Pan
- Mina → Metal
- Tablones + Ladrillos → Vivienda mejorada
- Escuela → Conocimiento
- Centro de resiliencia → Mitigación de perturbaciones

### Flujos y logística

Las conexiones representan flujos con recurso, capacidad, peso y eficiencia. La logística afecta la producción efectiva y genera cuellos de botella visibles. La pestaña **Pesos** incluye una primera estructura funcional para distribución de madera, piedra y comida, preparada para pesos editables completos.

### Fórmulas

`src/engine/formulas.ts` centraliza las fórmulas de trabajadores, logística, multiplicadores tecnológicos, disponibilidad de inputs, almacenamiento, producción efectiva, producción neta, cuellos de botella, estimación de tiempos, resiliencia, riesgo de perturbación e índice de optimización.

Producción efectiva conceptual:

```text
producción base × trabajadores × logística × tecnología × inputs × almacenamiento
```

### Índice de optimización

El índice combina eficiencia media de procesos, eficiencia logística, uso de trabajadores, estabilidad de recursos, resiliencia y ratio de procesos activos, con penalizaciones por cuellos de botella, procesos parados y recursos limitantes. Se muestra siempre en la barra superior con tendencia, pérdida principal y recurso limitante.

### Investigación

El árbol está abierto y organizado en ramas: Producción, Logística, Optimización, Datos y Resiliencia. No hay rama militar ni matemáticas puras. Las tecnologías tienen id, coste, requisitos, descripción, efectos y desbloqueos.

### Resiliencia y perturbaciones

Resiliencia sustituye a defensa/militar. Las perturbaciones son fallos logísticos, picos de demanda, averías, escasez, bloqueos de conexión, saturación, pérdida de eficiencia, crisis alimentaria o pérdida abstracta de recursos. El sistema calcula riesgo según intensidad y resiliencia disponible.

### Asesor

El asesor por reglas detecta recurso limitante, déficit, procesos sin trabajadores, falta de inputs, logística baja y resiliencia baja. Sus niveles quedan preparados para diagnóstico básico, recomendador simple, explicación avanzada, simulador de escenarios y optimizador futuro.

### Datos, hitos y contratos

La pestaña Datos muestra índice, eficiencia, producción neta y una mini gráfica histórica. La progresión ya no usa capítulos cerrados: hay hitos, contratos de optimización, objetivos dinámicos y horizontes tecnológicos. Completar un horizonte no termina la partida; abre una dirección nueva.

### Guardado

La versión de guardado actual es `0.3.0`. Si se carga un guardado incompatible, la app reinicia de forma segura con el mensaje: “El guardado anterior no era compatible con esta versión. Se ha iniciado una nueva simulación.”

## Roadmap

- Pesos redistribuibles completos.
- Capacidad de aristas y saturación explícita.
- Redes múltiples.
- Optimización asistida.
- Simulador de escenarios.
- Análisis de sensibilidad.
- Gráficas avanzadas.
- Mantenimiento preventivo activo.
- Energía y herramientas como cadenas completas.
- Rutas redundantes.
- Editor de recetas.
- Modos desafío.
- Exportación de métricas.
