---
kind: tasks
name: fraction-add-subtract
version: 0.1.0
description: Tareas atomicas para incorporar suma y resta de fracciones guiadas al laboratorio.
---

# Tasks — `fraction-add-subtract`

> Generado desde [`plan.md`](plan.md) y [`design.md`](design.md). Cada tarea es pequena, verificable y pensada para implementarse de forma incremental sobre el laboratorio ya existente.

<!-- DAG
TASK-001 -> TASK-002
TASK-002 -> TASK-003
TASK-002 -> TASK-004
TASK-003 -> TASK-005
TASK-004 -> TASK-005
-->

## TASK-001 — Ampliar la UI del laboratorio para Sumar y Restar

- **Status:** done
- **References:** REQ-001, REQ-002, REQ-003, REQ-009, REQ-010, ADR-002
- **Depends on:** —
- **Modules touched:** `index.html`, `styles.css`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** el laboratorio actual con comparar, multiplicar y dividir
  - **When** se amplie la navegacion principal
  - **Then** el usuario ve tambien `Sumar` y `Restar` como actividades del mismo laboratorio sin perder claridad visual

## TASK-002 — Extender el motor comun para soportar suma y resta

- **Status:** done
- **References:** REQ-001, REQ-002, REQ-003, REQ-005, REQ-008, REQ-010, ADR-001, ADR-002
- **Depends on:** TASK-001
- **Modules touched:** `app.js`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la nueva navegacion de actividades
  - **When** el motor del laboratorio registre suma y resta
  - **Then** la app puede cambiar a esas actividades, mostrar sus tecnicas y generar retos guiados sin romper las actividades existentes

## TASK-003 — Implementar suma con mismo y distinto denominador guiado

- **Status:** done
- **References:** REQ-001, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, ADR-001
- **Depends on:** TASK-002
- **Modules touched:** `app.js`, `styles.css`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la actividad `Sumar`
  - **When** el usuario resuelve retos de mismo denominador y distinto denominador
  - **Then** la app muestra opciones guiadas, explica como operar o igualar denominadores y no exige simplificacion final como foco principal

## TASK-004 — Implementar resta con mismo y distinto denominador guiado

- **Status:** done
- **References:** REQ-002, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, ADR-001
- **Depends on:** TASK-002
- **Modules touched:** `app.js`, `styles.css`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la actividad `Restar`
  - **When** el usuario resuelve retos de mismo denominador y distinto denominador
  - **Then** la app muestra opciones guiadas, explica como restar o igualar denominadores y mantiene una progresion clara para un nino

## TASK-005 — Verificar integracion completa de MG-21

- **Status:** done
- **References:** REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, ADR-001, ADR-002
- **Depends on:** TASK-003, TASK-004
- **Modules touched:** `app.js`, `index.html`, `styles.css`, `README.md`, `AGENTS.md`
- **Skill:** `(none)`
- **Command / Subagent:** `lg5-code-reviewer`
- **Acceptance:**
  - **Given** la implementacion completa de suma y resta
  - **When** se revisa el laboratorio de extremo a extremo
  - **Then** suma y resta funcionan con tecnicas guiadas, no rompen las actividades previas y la documentacion queda alineada con la nueva capacidad del laboratorio

## Definition of Done (Tasks)

- [x] Every TASK references ≥1 REQ-NNN.
- [x] Every TASK has Given/When/Then acceptance criteria.
- [x] Every TASK is ≤1 day of work / 1-3 commits.
- [x] Dependencies form a DAG (no cycles) — verify against `plan.md`.
- [x] First TASK is the project skeleton (or smallest precondition).
- [x] Last TASK is "all ATDD scenarios green + zero `must` violations".
- [x] Each TASK names the exact module(s), skill(s), and command(s)/
      subagent(s) it uses.

Note: the final TASK adapts the ATDD wording to this repository, which still
uses structured manual verification instead of an automated acceptance suite.
