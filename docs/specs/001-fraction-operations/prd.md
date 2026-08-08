---
kind: prd
name: fraction-operations
version: 0.2.0
description: Evolucion funcional de la app hacia un laboratorio base de practica matematica, empezando por comparacion, multiplicacion y division de fracciones.
---

# PRD — `fraction-operations`

## 1. Summary

La app debe evolucionar de un juego centrado solo en comparar fracciones a un laboratorio base de practica matematica, pensado para un nino de 10 anos. La experiencia debe seguir siendo visual, simple y rapida, pero ahora debe permitir practicar comparacion, multiplicacion y division sin confundir al usuario ni mezclar reglas distintas en una misma pantalla. Ademas, debe incorporar elementos de motivacion y tecnicas de aprendizaje infantil basadas en practica guiada, repeticion, progresion por dominio y refuerzo positivo, dejando preparada la base para futuros temas matematicos.

## 2. Problem

Hoy la aplicacion completa esta orientada a una unica mecanica: elegir cual fraccion es mayor. Esa estructura funciona bien para comparacion, pero no encaja de forma natural con multiplicacion y division, porque esos ejercicios requieren otro tipo de reto, otra explicacion y otra forma de responder. Si se anaden sin replantear la estructura, la experiencia puede volverse confusa para un nino. Ademas, la practica actual no incorpora una progresion pedagogica explicita ni un sistema de motivacion que anime a mantener el esfuerzo, mejorar y consolidar aprendizajes como la simplificacion, ni deja una base clara para crecer a otros temas matematicos.

## 3. Users

- **Nino que practica fracciones** — quiere resolver ejercicios claros, visuales y rapidos sin sentirse perdido.
- **Adulto que acompana el aprendizaje** — quiere ofrecer una herramienta sencilla, ordenada y adecuada para practicar distintos tipos de operaciones con fracciones.
- **Sistema de practica** — necesita presentar cada actividad con reglas y ayudas acordes al tipo de ejercicio.

## 4. Success metrics

| Metric | Baseline | Target | Window |
|--------|---------:|-------:|--------|
| Tipos de actividad disponibles para practicar | 1 | 3 | al publicar la feature |
| Pantallas principales con instrucciones consistentes segun actividad | 1 | 3 | al publicar la feature |

## 5. Requirements (in scope)

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | El sistema debe presentar la app como una experiencia general de practica de fracciones y no solo como un comparador. | Al entrar en la app, el usuario entiende que puede practicar mas de un tipo de actividad con fracciones. |
| REQ-002 | El sistema debe permitir elegir entre practicar comparacion, multiplicacion y division de fracciones. | El usuario puede cambiar de actividad desde la interfaz principal sin recargar la pagina. |
| REQ-003 | El sistema debe mostrar una dinamica de ejercicio adaptada a cada actividad. | Cada actividad presenta un reto comprensible y coherente con el tipo de ejercicio que se esta practicando. |
| REQ-004 | El sistema debe mantener una experiencia clara y adecuada para un nino de 10 anos. | Las instrucciones, ayudas y mensajes de resultado usan lenguaje corto, directo y facil de entender. |
| REQ-005 | El sistema debe conservar la practica de comparacion que ya existe como una actividad disponible. | El usuario puede seguir practicando comparacion con una experiencia equivalente o mejor que la actual. |
| REQ-006 | El sistema debe incorporar ejercicios de multiplicacion entre fracciones con respuesta guiada mediante opciones. | El usuario puede completar ejercicios de multiplicacion entre fracciones eligiendo entre opciones y recibe confirmacion inmediata de si acerto. |
| REQ-007 | El sistema debe incorporar ejercicios de division entre fracciones con respuesta guiada mediante opciones. | El usuario puede completar ejercicios de division entre fracciones eligiendo entre opciones y recibe confirmacion inmediata de si acerto. |
| REQ-008 | El sistema debe exigir la simplificacion del resultado cuando la operacion lo permita. | Cuando exista una forma simplificada del resultado, la respuesta correcta visible para el usuario corresponde a esa forma simplificada. |
| REQ-009 | El sistema debe ofrecer una explicacion corta o pista relacionada con la regla de cada actividad y, cuando aplique, con la simplificacion. | Antes o despues de responder, el usuario puede ver una ayuda breve que corresponde al tipo de ejercicio actual y al paso de simplificar. |
| REQ-010 | El sistema debe mantener una sola puntuacion global de aciertos y racha durante la practica. | El usuario ve un marcador comun que se actualiza al responder en cualquier actividad. |
| REQ-011 | El sistema debe permitir avanzar a un nuevo reto solo cuando el usuario lo decida. | Tras responder, el ejercicio actual permanece visible hasta que el usuario pulsa para continuar. |
| REQ-012 | El sistema debe incluir un sistema de motivacion con logros, medallas o retos de progreso. | El usuario recibe mensajes o reconocimientos visibles al alcanzar hitos de practica o mejora. |
| REQ-013 | El sistema debe aplicar una progresion de aprendizaje infantil basada en practica guiada, repeticion y aumento gradual de dificultad. | Los retos y ayudas se perciben ordenados, con apoyo suficiente al inicio y mayor autonomia cuando el usuario progresa. |
| REQ-014 | El sistema debe dejar preparada una estructura funcional que permita anadir nuevas actividades matematicas en el futuro sin rehacer toda la experiencia principal. | La organizacion visible de la app diferencia entre tipo de actividad actual y futuras ampliaciones posibles. |

## 6. Out of scope

- Introducir problemas verbales o situaciones narrativas — _(reason: esta feature se centra en reorganizar la practica base de fracciones)_
- Incluir suma y resta de fracciones — _(reason: no forman parte del alcance pedido para esta evolucion)_
- Expandir a otros dominios matematicos completos como decimales, porcentajes o geometria — _(reason: esta feature deja la base preparada, pero el alcance implementado sigue centrado en fracciones)_

## 7. Acceptance criteria (feature-level)

- [ ] La app deja claro que existen varias actividades de practica con fracciones.
- [ ] Comparacion, multiplicacion y division pueden practicarse desde la misma experiencia sin confusion entre reglas.
- [ ] Cada actividad ofrece feedback inmediato y una explicacion breve alineada con su mecanica.
- [ ] La experiencia sigue siendo adecuada para un nino de 10 anos por claridad visual y simplicidad de uso.
- [ ] La estructura resultante deja preparada la app para crecer como laboratorio base de matematicas.

## 8. Open questions

| Question | Decider | Due |
|---------|---------|-----|
| Formato de respuesta confirmado: opciones guiadas. Simplificacion confirmada: obligatoria cuando aplique. Puntuacion confirmada: global para todas las actividades. | Luis Quiroga | resuelto 2026-08-08 |
| Product owner y aprobador funcional de la feature. | Luis Quiroga | resuelto 2026-08-08 |

## Definition of Done (PRD)

- [x] Every requirement has a stable ID (REQ-NNN).
- [x] No technology mentioned (no Spring, Kafka, Postgres, REST, …).
- [x] Every requirement has at least one acceptance criterion.
- [x] Pending clarifications resolved or explicitly documented.
- [x] Out-of-scope items explicitly listed with reason.
- [x] Stakeholder/owner identified (in the open questions table).
