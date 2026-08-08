---
kind: adr
name: activity-based-lab-structure
version: 0.1.0
description: Reorganizar la app desde un comparador unico hacia un laboratorio de actividades matematicas.
---

# ADR-001: Estructurar la app como laboratorio por actividades

- **Status:** Accepted
- **Date:** 2026-08-08
- **Deciders:** Luis Quiroga, OpenCode agent
- **Consulted:** Ninguno
- **Informed:** Mathias Garcia

## Context

La app actual esta centrada en una sola mecanica: comparar dos fracciones. La nueva feature exige incorporar multiplicacion y division, lo que introduce dinamicas de reto distintas y rompe la coherencia de la pantalla actual si se anade como parche. El usuario ademas quiere que el proyecto quede como base para temas matematicos mas complejos en el futuro.

## Decision

Convertiremos la app en un laboratorio base de practica matematica por actividades. La experiencia principal se organizara primero por actividad y despues por reto, permitiendo que comparacion, multiplicacion y division compartan una estructura comun sin imponer la misma mecanica visual a todas.

## Alternatives considered

- **Anadir multiplicacion y division dentro de la pantalla actual** — mantener la estructura existente y sumar botones nuevos.
  - Pros: menos cambios inmediatos.
  - Cons: mezcla mecanicas incompatibles en una pantalla pensada para comparar izquierda/derecha.
  - Why not chosen: aumenta confusion y limita el crecimiento futuro.

- **Crear una app separada para operaciones** — dejar comparacion intacta y abrir otra experiencia nueva.
  - Pros: separacion total entre experiencias.
  - Cons: duplica navegacion, progreso y mantenimiento.
  - Why not chosen: el usuario quiere una base evolutiva unica.

## Consequences

- **Positive:** la app gana una base clara para crecer a nuevas actividades y temas.
- **Positive:** cada tipo de ejercicio puede tener su propia dinamica sin perder coherencia global.
- **Negative:** requiere refactorizar la estructura actual antes de anadir contenido nuevo.
- **Neutral:** comparacion pasa de ser el producto completo a ser una actividad dentro de un marco mayor.

## Constitutional impact

- RULE-001 — no relevante; este repositorio no es un servicio lg5-spring.
- RULE-003 — no relevante; no existe arquitectura hexagonal ni dominio backend en esta app estatica.
- RULE-004 — no relevante; la estructura canonica de 8 modulos no aplica a un frontend vanilla monorepo simple.

## Implementation notes

- Soporta el PRD `docs/specs/001-fraction-operations/prd.md`.
- El plan tecnico se describe en `docs/specs/001-fraction-operations/plan.md`.

## Related ADRs

- ADR-002 — Definir estrategia de aprendizaje guiado y motivacion.

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
