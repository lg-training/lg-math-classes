---
kind: tasks
name: fraction-operations
version: 0.1.0
description: Tareas atomicas para convertir la app en un laboratorio base de fracciones.
---

# Tasks — `fraction-operations`

> Generado desde [`plan.md`](plan.md) y [`design.md`](design.md). Cada tarea es pequena, verificable y apta para implementarse en 1-3 commits.

<!-- DAG
TASK-001 -> TASK-002
TASK-002 -> TASK-003
TASK-002 -> TASK-004
TASK-002 -> TASK-005
TASK-003 -> TASK-006
TASK-004 -> TASK-006
TASK-005 -> TASK-006
TASK-006 -> TASK-007
-->

## TASK-001 — Preparar la base visual del laboratorio

- **Status:** done
- **References:** REQ-001, REQ-002, REQ-004, REQ-014, ADR-001
- **Depends on:** —
- **Modules touched:** `index.html`, `styles.css`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la app actual centrada en comparacion
  - **When** se carga la nueva estructura principal
  - **Then** la interfaz presenta la app como practica de fracciones y muestra navegacion clara por actividades sin romper el aspecto infantil y simple

## TASK-002 — Extraer un motor comun de actividades y retos

- **Status:** done
- **References:** REQ-003, REQ-010, REQ-011, REQ-014, ADR-001
- **Depends on:** TASK-001
- **Modules touched:** `app.js`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la nueva estructura de laboratorio visible
  - **When** el codigo genera y evalua retos
  - **Then** existe un flujo comun para actividad activa, reto activo, respuesta, feedback y avance manual a nueva pregunta

## TASK-003 — Reencajar comparacion como actividad del laboratorio

- **Status:** done
- **References:** REQ-003, REQ-005, REQ-009, REQ-010, REQ-011, ADR-001
- **Depends on:** TASK-002
- **Modules touched:** `app.js`, `styles.css`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** el motor comun de actividades
  - **When** el usuario selecciona `Comparar`
  - **Then** la experiencia actual de comparacion sigue funcionando correctamente dentro del nuevo marco, con pista, explicacion, marcador global y avance manual

## TASK-004 — Implementar multiplicacion con opciones y simplificacion

- **Status:** done
- **References:** REQ-003, REQ-006, REQ-008, REQ-009, REQ-010, REQ-011, ADR-001, ADR-002
- **Depends on:** TASK-002
- **Modules touched:** `app.js`, `index.html`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la actividad `Multiplicar`
  - **When** el usuario resuelve un reto de multiplicacion entre fracciones
  - **Then** la app muestra opciones guiadas, marca como correcta la respuesta simplificada y ofrece una explicacion corta de la regla y la simplificacion

## TASK-005 — Implementar division con opciones y simplificacion

- **Status:** done
- **References:** REQ-003, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, ADR-001, ADR-002
- **Depends on:** TASK-002
- **Modules touched:** `app.js`, `index.html`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** la actividad `Dividir`
  - **When** el usuario resuelve un reto de division entre fracciones
  - **Then** la app muestra opciones guiadas, valida la respuesta simplificada correcta y explica de forma breve que se invierte la segunda fraccion y luego se multiplica

## TASK-006 — Anadir progresion guiada, logros y medallas

- **Status:** done
- **References:** REQ-004, REQ-009, REQ-010, REQ-012, REQ-013, ADR-002
- **Depends on:** TASK-003, TASK-004, TASK-005
- **Modules touched:** `app.js`, `styles.css`
- **Skill:** `(none)`
- **Command / Subagent:** `(none)`
- **Acceptance:**
  - **Given** las tres actividades ya operativas
  - **When** el usuario acierta, encadena respuestas o progresa en dificultad
  - **Then** la app actualiza el marcador global, desbloquea logros visibles y mantiene una progresion pedagogica clara entre apoyo inicial y reto creciente

## TASK-007 — Verificar el laboratorio completo y cerrar MG-20

- **Status:** done
- **References:** REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013, REQ-014, ADR-001, ADR-002
- **Depends on:** TASK-006
- **Modules touched:** `index.html`, `app.js`, `styles.css`, `service-worker.js`
- **Skill:** `(none)`
- **Command / Subagent:** `lg5-code-reviewer`
- **Acceptance:**
  - **Given** la implementacion completa del laboratorio de fracciones
  - **When** se realiza la verificacion manual de todas las actividades y una revision final del cambio
  - **Then** comparar, multiplicar y dividir funcionan de forma coherente, no hay regresiones visibles, y no quedan violaciones relevantes para el contexto del repo

## Definition of Done (Tasks)

- [x] Every TASK references ≥1 REQ-NNN.
- [x] Every TASK has Given/When/Then acceptance criteria.
- [x] Every TASK is ≤1 day of work / 1-3 commits.
- [x] Dependencies form a DAG (no cycles) — verify against `plan.md`.
- [x] First TASK is the project skeleton (or smallest precondition).
- [x] Last TASK is "all ATDD scenarios green + zero `must` violations".
- [x] Each TASK names the exact module(s), skill(s), and command(s)/
      subagent(s) it uses.

Note: the final TASK adapts the template's ATDD wording to this repository,
which currently relies on structured manual verification rather than an
automated ATDD suite.
