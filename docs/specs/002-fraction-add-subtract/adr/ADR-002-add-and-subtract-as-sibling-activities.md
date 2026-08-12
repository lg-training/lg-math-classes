---
kind: adr
name: add-and-subtract-as-sibling-activities
version: 0.1.0
description: Organizar suma y resta como actividades hermanas dentro de una sola linea de trabajo del laboratorio.
---

# ADR-002: Organizar suma y resta como actividades hermanas dentro del laboratorio

- **Status:** Accepted
- **Date:** 2026-08-08
- **Deciders:** Luis Quiroga, OpenCode agent
- **Consulted:** Ninguno
- **Informed:** Mathias Garcia

## Context

La tarea MG-21 agrupa suma y resta como una sola linea pedagogica. Aun asi, cada operacion tiene lenguaje, pistas y tecnicas propias. Hace falta decidir si se presentan como una sola actividad mezclada o como dos actividades hermanas dentro de la misma expansion.

## Decision

Presentaremos `Sumar` y `Restar` como actividades hermanas dentro del laboratorio, compartiendo la misma feature y progresion general, pero con tecnicas y mensajes diferenciados en la interfaz.

## Alternatives considered

- **Una sola actividad mezclada de suma/resta** — alternar ambos tipos de reto sin separacion principal.
  - Pros: menos botones y menos navegacion.
  - Cons: difumina la tecnica concreta que el nino debe aprender en cada momento.
  - Why not chosen: la claridad pedagogica es mas importante que ahorrar un clic.

- **Dos features completamente separadas** — una para suma y otra para resta.
  - Pros: independencia total entre desarrollos.
  - Cons: duplica esfuerzo y rompe la idea de una linea pedagogica comun.
  - Why not chosen: el usuario pidio tratarlas juntas.

## Consequences

- **Positive:** se mantiene claridad operativa y coherencia dentro del laboratorio.
- **Positive:** las tecnicas compartidas pueden reaprovecharse sin mezclar mensajes.
- **Negative:** hay que ampliar la navegacion de actividades una vez mas.
- **Neutral:** el laboratorio gana mas anchura tematica dentro del mismo dominio de fracciones.

## Constitutional impact

- RULE-001 — no relevante; el repo no usa stack lg5-spring.
- RULE-003 — no relevante; no existe capa de dominio backend ni arquitectura hexagonal en esta app.
- RULE-004 — no relevante; el repo no sigue la forma de servicio backend de 8 modulos.

## Implementation notes

- Soporta el PRD `docs/specs/002-fraction-add-subtract/prd.md`.
- El frontend actual de actividades debe ampliarse para introducir `Sumar` y `Restar` como opciones principales adicionales.

## Related ADRs

- ADR-001 — Priorizar tecnicas guiadas de suma y resta antes que simplificacion final.

## Definition of Done (ADR)

- [x] Status is one of `Proposed | Accepted | Deprecated | Superseded`.
- [x] Decision is stated in active voice ("We will…").
- [x] At least one alternative is documented (otherwise it is not a real
      decision — downgrade to a doc note).
- [x] Consequences cover positive AND negative.
- [x] Constitutional impact section names every relevant `must` rule.
- [x] Any `must` override is time-boxed with a tech-debt link.

---

_Originally drafted: 2026-08-08 · Last reviewed: 2026-08-08._
