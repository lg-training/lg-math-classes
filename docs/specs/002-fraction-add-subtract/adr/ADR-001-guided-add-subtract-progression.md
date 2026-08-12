---
kind: adr
name: guided-add-subtract-progression
version: 0.1.0
description: Definir una progresion guiada para suma y resta de fracciones con foco en tecnicas antes que en simplificacion final.
---

# ADR-001: Priorizar tecnicas guiadas de suma y resta antes que simplificacion final

- **Status:** Accepted
- **Date:** 2026-08-08
- **Deciders:** Luis Quiroga, OpenCode agent
- **Consulted:** Ninguno
- **Informed:** Mathias Garcia

## Context

La siguiente ampliacion del laboratorio debe ensenar suma y resta de fracciones a un nino de 10 anos. El usuario quiere que la experiencia incluya tanto mismo denominador como distinto denominador, pero con mucho apoyo, y que se practiquen tecnicas como igualar denominadores o usar multiplicacion cruzada sin exigir todavia simplificacion final como objetivo principal.

## Decision

Disenaremos suma y resta como una progresion muy guiada donde el foco principal sera dominar la tecnica correcta para operar fracciones con mismo y distinto denominador. La simplificacion podra aparecer como explicacion secundaria, pero no sera el criterio principal de exito de esta feature.

## Alternatives considered

- **Exigir simplificacion final desde el inicio** — combinar tecnica de suma/resta y simplificacion como un solo reto.
  - Pros: entrena mas habilidades a la vez.
  - Cons: aumenta la carga cognitiva y puede confundir el objetivo principal.
  - Why not chosen: el usuario quiere centrar esta fase en las tecnicas de suma y resta.

- **Solo practicar mismo denominador** — dejar distinto denominador para una future feature.
  - Pros: progresion mas simple.
  - Cons: deja fuera justo una de las tecnicas mas interesantes para el usuario.
  - Why not chosen: el usuario pidio incluir tambien distinto denominador desde esta fase.

## Consequences

- **Positive:** el nino puede interiorizar mejor la tecnica que toca usar en cada caso.
- **Positive:** la progresion se vuelve mas natural y menos abrumadora.
- **Negative:** algunas respuestas correctas no reforzaran todavia simplificacion como objetivo principal.
- **Neutral:** la simplificacion queda abierta para un refinamiento posterior o para niveles mas avanzados.

## Constitutional impact

- RULE-001 — no relevante; este repositorio no usa el stack lg5-spring.
- RULE-004 — no relevante; esta app es un frontend estatico, no un microservicio de 8 modulos.
- RULE-014 — no relevante; no se introducen configuraciones backend con prefijos canonicos.

## Implementation notes

- Soporta el PRD `docs/specs/002-fraction-add-subtract/prd.md`.
- El diseno debera reflejar actividades hermanas de suma y resta con tecnicas propias y nivel guiado fuerte.

## Related ADRs

- ADR-002 — Estructurar suma y resta como actividades hermanas dentro del laboratorio.

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
