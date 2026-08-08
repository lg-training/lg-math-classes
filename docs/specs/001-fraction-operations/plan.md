---
kind: plan
name: fraction-operations
version: 0.1.0
description: Plan tecnico para transformar la app actual en un laboratorio base de practica de fracciones.
---

# Plan — `fraction-operations`

## Architecture overview

Arquitectura ligera de frontend estatico organizada por capas funcionales del laboratorio:

```
ui-shell
  ├── hero + identidad                # presenta el laboratorio y su proposito
  ├── scoreboard + logros             # muestra aciertos, racha y medallas
  └── activity navigation             # permite cambiar entre comparar, multiplicar y dividir

challenge-engine
  ├── activity registry               # define que actividades existen y como se activan
  ├── challenge generators            # crea retos por actividad y dificultad
  ├── option builder                  # genera respuestas guiadas plausibles
  └── answer evaluator                # valida respuesta, simplificacion y progreso

feedback-and-learning
  ├── hints and explanations          # muestra regla breve y ayuda contextual
  ├── progression rules               # gestiona apoyo inicial y aumento gradual de dificultad
  └── motivation events               # decide medallas, mensajes y pequenos hitos

presentation-assets
  ├── fraction visuals                # tarjetas, fracciones y apoyos visuales
  └── responsive styles               # experiencia clara en movil y desktop
```

## Module ↔ requirement matrix

Every PRD requirement must be covered by ≥1 module.

| Module | Covers REQ |
|--------|------------|
| ui-shell | REQ-001, REQ-002, REQ-004, REQ-014 |
| challenge-engine | REQ-003, REQ-005, REQ-006, REQ-007, REQ-008, REQ-011 |
| feedback-and-learning | REQ-004, REQ-008, REQ-009, REQ-010, REQ-012, REQ-013 |
| presentation-assets | REQ-004, REQ-005, REQ-006, REQ-007 |

## ADR index

- [ADR-001](adr/ADR-001-activity-based-lab-structure.md) — Convertir la app en laboratorio por actividades.
- [ADR-002](adr/ADR-002-guided-learning-and-motivation.md) — Aplicar aprendizaje guiado, simplificacion y motivacion visible.

## Sequenced steps

See [`tasks.md`](tasks.md) for the full TASK-NNN list. Summary of the
dependency graph:

```
TASK-001 ──► TASK-002 ──► TASK-003 ──► TASK-004
   │             │             │
   └────────────► TASK-005 ◄───┘
```

Propuesta de secuencia:

- TASK-001: refactorizar la estructura visible para soportar actividades.
- TASK-002: extraer un motor comun de retos y evaluacion.
- TASK-003: reencajar comparacion como actividad dentro del nuevo marco.
- TASK-004: anadir multiplicacion y division con simplificacion obligatoria.
- TASK-005: anadir logros, medallas y progresion guiada.

## Cross-cutting concerns

- **Rendimiento y simplicidad:** mantener todo en cliente sin dependencias pesadas. Owner: Engineering.
- **Aprendizaje infantil:** mensajes cortos, refuerzo positivo y progresion gradual. Owner: Product owner.
- **Responsive / accesibilidad basica:** botones grandes, lectura clara y flujo comprensible en movil. Owner: Engineering.
- **Persistencia:** no se introduce almacenamiento persistente en esta fase; el progreso es de sesion. Owner: Engineering.

## Risks

| ID | Risk | Mitigation | Owner |
|----|------|------------|-------|
| R1 | Que la nueva estructura complique demasiado la experiencia frente a la app actual. | Mantener una sola pantalla principal, lenguaje corto y acciones muy visibles. | Engineering |
| R2 | Que la simplificacion obligatoria frustre al nino si aparece demasiado pronto. | Introducir explicaciones y opciones plausibles, con dificultad gradual. | Product owner |
| R3 | Que el sistema de motivacion distraiga mas de lo que ayuda. | Usar logros pequenos y mensajes breves, sin sobrecargar la pantalla. | Engineering |
| R4 | Que la plantilla SDD del bundle este pensada para microservicios y no encaje 1:1 con este frontend. | Usar el flujo SDD como disciplina de especificacion, adaptando el plan a modulos funcionales del frontend. | Engineering |

## Estimated artifact count

- New files: `~4`
- Modified files: `~4`
- New tests: `~0` (no hay suite automatizada en este repo por ahora)

## Definition of Done (Plan)

- [x] Every PRD requirement is covered by ≥1 module in the matrix above.
- [x] Every architectural decision is captured as an ADR under `adr/`.
- [x] Constitutional rule violations explicitly listed and justified
      (or zero).
- [ ] Module map matches RULE-004 (service module shape).
- [x] Open questions explicitly listed (under "Risks" or in PRD §8).
- [x] All cross-cutting concerns assigned to a team/owner.

Note: the unchecked RULE-004 item is intentional because this repository is a
static frontend laboratory and not an `lg5-spring` microservice with the
canonical 8-module backend shape.
