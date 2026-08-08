---
kind: adr
name: guided-learning-and-motivation
version: 0.1.0
description: Definir respuestas guiadas, simplificacion obligatoria y sistema de motivacion para la practica infantil.
---

# ADR-002: Aplicar aprendizaje guiado y motivacion visible

- **Status:** Accepted
- **Date:** 2026-08-08
- **Deciders:** Luis Quiroga, OpenCode agent
- **Consulted:** Ninguno
- **Informed:** Mathias Garcia

## Context

El usuario quiere que la experiencia ayude de verdad a aprender, no solo a acertar. Tambien quiere introducir motivacion tipo medallas o retos y exige que multiplicacion y division trabajen simplificacion. Para un nino de 10 anos, la experiencia debe equilibrar apoyo, claridad, repeticion y recompensa visible.

## Decision

Usaremos respuesta guiada por opciones, puntuacion global compartida, simplificacion obligatoria cuando aplique, explicaciones cortas y un sistema de medallas o logros por progreso. La dificultad y la ayuda se organizaran de forma gradual para apoyar el dominio paso a paso.

## Alternatives considered

- **Respuesta libre escrita desde el inicio** — pedir que el nino escriba el resultado.
  - Pros: exige recuerdo completo y mas autonomia.
  - Cons: sube friccion, aumenta errores de formato y dificulta el feedback rapido.
  - Why not chosen: no es la mejor entrada para esta fase del laboratorio.

- **No exigir simplificacion** — aceptar cualquier fraccion equivalente.
  - Pros: reduce complejidad inicial.
  - Cons: deja fuera una habilidad clave que el usuario quiere trabajar.
  - Why not chosen: el product owner pidio incluir simplificacion como parte del juego.

- **Motivacion solo con marcador numerico** — mantener solo aciertos y racha.
  - Pros: implementacion minima.
  - Cons: ofrece menos impulso emocional y menos sensacion de avance.
  - Why not chosen: se busca reforzar continuidad y orgullo por progreso.

## Consequences

- **Positive:** la practica sera mas accesible, consistente y motivante.
- **Positive:** la simplificacion queda integrada como parte del aprendizaje esperado.
- **Negative:** generar opciones plausibles y explicaciones utiles requiere mas logica que el modelo actual.
- **Neutral:** el juego prioriza dominio guiado antes que entrada libre avanzada.

## Constitutional impact

- RULE-001 — no relevante; este repositorio no usa el stack lg5-spring.
- RULE-012 — no relevante; no existe suite IT/ATDD ni perfiles Spring en esta app.
- RULE-014 — no relevante; no hay configuraciones con prefijos canonicos de backend.

## Implementation notes

- Soporta el PRD `docs/specs/001-fraction-operations/prd.md`.
- Debe reflejarse en el motor de retos, el feedback y la capa visual.

## Related ADRs

- ADR-001 — Estructurar la app como laboratorio por actividades.

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
