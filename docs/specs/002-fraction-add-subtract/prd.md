---
kind: prd
name: fraction-add-subtract
version: 0.2.0
description: Evolucion funcional del laboratorio para practicar suma y resta de fracciones como una sola linea pedagogica.
---

# PRD — `fraction-add-subtract`

## 1. Summary

La app debe ampliar el laboratorio de fracciones para incluir practica de suma y resta de fracciones como una sola linea de aprendizaje. La experiencia debe mantener un tono visual, claro y amigable para un nino de 10 anos, introduciendo tecnicas progresivas, respuestas guiadas y un enfoque especialmente guiado cuando aparezcan fracciones con distinto denominador.

## 2. Problem

El laboratorio actual ya cubre comparacion, multiplicacion y division, pero aun no permite practicar suma y resta de fracciones. Sin estas operaciones, el recorrido de aprendizaje queda incompleto y se pierde la oportunidad de reforzar tecnicas fundamentales como mismo denominador, denominador comun e igualacion de denominadores mediante estrategias guiadas como la multiplicacion cruzada.

## 3. Users

- **Nino que practica fracciones** — quiere aprender a sumar y restar fracciones paso a paso, sin sentirse perdido.
- **Adulto que acompana el aprendizaje** — quiere una practica guiada y progresiva que fortalezca habilidades reales sin sentirse como una clase pesada.
- **Sistema de practica** — necesita presentar tecnicas distintas para suma y resta y graduar el apoyo segun el nivel.

## 4. Success metrics

| Metric | Baseline | Target | Window |
|--------|---------:|-------:|--------|
| Nuevas actividades operativas dentro del laboratorio | 0 | 2 | al publicar la feature |
| Tecnicas de suma/resta disponibles por nivel | 0 | 3 o mas | al publicar la feature |

## 5. Requirements (in scope)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | El sistema debe incorporar practica de suma de fracciones dentro del laboratorio actual. | El usuario puede entrar en una actividad de suma y resolver retos desde la misma experiencia principal. |
| REQ-002 | El sistema debe incorporar practica de resta de fracciones dentro del laboratorio actual. | El usuario puede entrar en una actividad de resta y resolver retos desde la misma experiencia principal. |
| REQ-003 | El sistema debe tratar suma y resta como una linea pedagogica comun, pero con tecnicas propias cuando haga falta. | El usuario ve tecnicas y ayudas acordes a la operacion que esta practicando. |
| REQ-004 | El sistema debe introducir tecnicas progresivas como mismo denominador, distinto denominador, denominador comun e igualacion guiada de denominadores. | El usuario puede practicar retos que reflejan esas tecnicas de forma visible, ordenada y comprensible. |
| REQ-005 | El sistema debe mantener respuestas guiadas por opciones. | El usuario responde eligiendo entre opciones claras sin necesidad de escribir el resultado. |
| REQ-006 | El sistema debe priorizar el aprendizaje de las tecnicas de suma y resta por encima de la simplificacion final en esta fase. | El usuario puede acertar la respuesta correcta segun la tecnica trabajada aunque el foco principal no sea simplificar el resultado. |
| REQ-007 | El sistema debe mostrar pistas y explicaciones cortas orientadas a aprendizaje, especialmente en retos con distinto denominador. | Antes o despues de responder, el usuario recibe ayuda breve sobre la tecnica que toca usar, incluyendo igualacion de denominadores cuando aplique. |
| REQ-008 | El sistema debe integrar suma y resta con el marcador global, logros y niveles del laboratorio. | Al practicar suma o resta, el usuario sigue acumulando aciertos, racha y progreso dentro de la misma experiencia. |
| REQ-009 | El sistema debe mantener una experiencia adecuada para un nino de 10 anos. | Los textos y la dificultad se sienten claros, progresivos y no abrumadores. |
| REQ-010 | El sistema debe dejar la estructura preparada para futuras tecnicas mas complejas de suma y resta. | La organizacion de actividades y tecnicas permite crecer sin rehacer la interfaz principal. |

## 6. Out of scope

- Problemas verbales o contextos narrativos largos — _(reason: esta feature se centra en mecanicas base de suma y resta)_
- Simplificacion obligatoria del resultado como objetivo principal — _(reason: en esta fase se quiere centrar la practica en dominar las tecnicas de suma y resta)_
- Numeros mixtos y fracciones impropias como foco principal — _(reason: conviene consolidar primero el recorrido base)_
- Persistir progreso entre sesiones — _(reason: sigue fuera del alcance actual del laboratorio)_

## 7. Acceptance criteria (feature-level)

- [ ] El laboratorio permite practicar suma y resta desde la misma experiencia principal.
- [ ] Las tecnicas pedagogicas de suma y resta se muestran de forma clara y progresiva.
- [ ] La practica guiada con distinto denominador ayuda a entender como igualar denominadores antes de operar.
- [ ] La experiencia mantiene feedback inmediato, niveles y logros sin romper el laboratorio actual.

## 8. Open questions

| Question | Decider | Due |
|---------|---------|-----|
| La progresion empezara guiada, pero incluira tambien retos con distinto denominador y tecnicas de igualacion como multiplicacion cruzada. | Luis Quiroga | resuelto 2026-08-08 |
| `Sumar` y `Restar` se mantienen como actividades hermanas dentro de una sola linea de trabajo. | Luis Quiroga | resuelto 2026-08-08 |
| En esta feature no se exigira simplificacion final como foco principal; el objetivo es dominar las tecnicas de suma y resta. | Luis Quiroga | resuelto 2026-08-08 |
| Product owner y aprobador funcional de la feature. | Luis Quiroga | resuelto 2026-08-08 |

## Definition of Done (PRD)

- [x] Every requirement has a stable ID (REQ-NNN).
- [x] No technology mentioned (no Spring, Kafka, Postgres, REST, …).
- [x] Every requirement has at least one acceptance criterion.
- [x] Pending clarifications resolved or explicitly documented.
- [x] Out-of-scope items explicitly listed with reason.
- [x] Stakeholder/owner identified (in the open questions table).
