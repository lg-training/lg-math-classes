---
kind: plan
name: fraction-add-subtract
version: 0.1.0
description: Plan tecnico para ampliar el laboratorio con suma y resta de fracciones.
---

# Plan — `fraction-add-subtract`

## Architecture overview

La ampliacion reutiliza la arquitectura ligera del laboratorio actual y añade dos nuevas actividades hermanas sobre el mismo motor:

```
ui-shell
  ├── activity navigation             # amplia la navegacion con Sumar y Restar
  ├── scoreboard + levels             # mantiene actividad, tecnica, nivel y logros
  └── learning guide                  # muestra tecnicas y explicaciones por actividad

challenge-engine
  ├── activity registry               # incorpora add y subtract al registro central
  ├── technique generators            # crea retos de mismo y distinto denominador
  ├── denominator equalizer hints     # explica como igualar denominadores paso a paso
  └── answer evaluator                # valida la opcion correcta sin exigir simplificacion final

feedback-and-learning
  ├── guided hints                    # explica la tecnica segun el tipo de reto
  ├── level progression               # hace crecer la dificultad sin abrumar
  └── achievement integration         # mantiene marcador y logros dentro del laboratorio

presentation-assets
  ├── fraction visuals                # sigue mostrando fracciones de forma clara
  └── responsive styles               # adapta nuevas actividades y tecnicas a movil y desktop
```

## Module ↔ requirement matrix

| Module | Covers REQ |
|--------|------------|
| ui-shell | REQ-001, REQ-002, REQ-003, REQ-009, REQ-010 |
| challenge-engine | REQ-001, REQ-002, REQ-004, REQ-005, REQ-006, REQ-010 |
| feedback-and-learning | REQ-003, REQ-004, REQ-007, REQ-008, REQ-009 |
| presentation-assets | REQ-005, REQ-007, REQ-008, REQ-009 |

## ADR index

- [ADR-001](adr/ADR-001-guided-add-subtract-progression.md) — Priorizar tecnicas guiadas antes que simplificacion final.
- [ADR-002](adr/ADR-002-add-and-subtract-as-sibling-activities.md) — Organizar suma y resta como actividades hermanas.

## Sequenced steps

See [`tasks.md`](tasks.md) for the full TASK-NNN list. Summary of the
dependency graph:

```
TASK-001 ──► TASK-002 ──► TASK-003 ──► TASK-005
               │             │
               └──────────► TASK-004 ──► TASK-005
```

Propuesta de secuencia:

- TASK-001: ampliar navegacion y panel pedagogico para `Sumar` y `Restar`.
- TASK-002: extender el motor comun para soportar retos de suma/resta.
- TASK-003: implementar suma con mismo y distinto denominador guiado.
- TASK-004: implementar resta con mismo y distinto denominador guiado.
- TASK-005: verificar integracion con niveles, logros y experiencia completa.

## Cross-cutting concerns

- **Aprendizaje guiado:** reforzar tecnicas de igualacion de denominadores con mensajes cortos y claros. Owner: Product owner.
- **Simplicidad visual:** evitar sobrecargar la pantalla al anadir mas actividades. Owner: Engineering.
- **Progresion:** introducir distinto denominador sin saltar demasiado rapido de dificultad. Owner: Product owner.
- **Compatibilidad con laboratorio actual:** no romper comparar, multiplicar y dividir ya publicados. Owner: Engineering.

## Risks

| ID | Risk | Mitigation | Owner |
|----|------|------------|-------|
| R1 | Que suma y resta anadan demasiada complejidad visual al laboratorio. | Reutilizar el motor y patrones ya existentes, manteniendo una sola superficie principal de reto. | Engineering |
| R2 | Que distinto denominador resulte demasiado dificil si entra muy pronto. | Introducirlo de forma guiada, con pistas de igualacion paso a paso. | Product owner |
| R3 | Que el usuario espere simplificacion obligatoria tambien en suma/resta. | Dejar clara la tecnica objetivo en mensajes y guias; simplificacion puede entrar luego como refinamiento. | Engineering |

## Estimated artifact count

- New files: `~3`
- Modified files: `~5`
- New tests: `~0` (seguimos sin suite automatizada en este repo)

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
