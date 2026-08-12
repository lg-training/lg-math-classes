---
kind: design
name: fraction-add-subtract
version: 0.1.0
description: Diseno detallado para ampliar el laboratorio con suma y resta de fracciones guiadas.
---

# Design — `fraction-add-subtract`

## 1. Scope and boundaries

Este diseno amplía el frontend del laboratorio actual para introducir `Sumar` y `Restar` como nuevas actividades hermanas. El alcance se mantiene dentro del cliente web/PWA existente, reutilizando el motor comun de retos, niveles, logros y ayudas.

- **In design**:
  - `index.html` para ampliar navegacion y mensajes por actividad. Cubre REQ-001, REQ-002, REQ-003, REQ-009, REQ-010.
  - `app.js` para anadir actividades de suma/resta, tecnicas por actividad, ayudas de igualacion de denominadores y validacion de respuestas guiadas. Cubre REQ-001 a REQ-010.
  - `styles.css` para soportar nuevas actividades y ayudas visuales sin sobrecargar la interfaz. Cubre REQ-005, REQ-007, REQ-008, REQ-009.
  - `README.md` y `AGENTS.md` si hace falta actualizar descripcion del laboratorio.
- **Out of design**:
  - Persistencia entre sesiones.
  - Simplificacion obligatoria como criterio principal de acierto.
  - Numeros mixtos como nuevo bloque didactico.

## 2. Domain model (sketch)

> No hay dominio backend. El “modelo” de esta feature son los objetos funcionales del frontend que extienden el laboratorio actual.

| Aggregate | Module | Invariants (1-liner) | Detailed in |
|-----------|--------|----------------------|-------------|
| `LabState` | `app.js` | El estado solo tiene una actividad, una tecnica y un reto activos a la vez. | `design.md §2.1` |
| `ArithmeticChallenge` | `app.js` | Todo reto de suma/resta define operacion, tecnica, opciones y explicacion guiada. | `design.md §2.2` |
| `TechniqueGuide` | `app.js` | Cada actividad expone tecnicas pedagogicas propias y mensajes segun nivel. | `design.md §2.3` |

### 2.1 `LabState`

Extiende el estado ya existente del laboratorio:

```js
const state = {
  activity: 'compare' | 'multiply' | 'divide' | 'add' | 'subtract',
  mode: string,
  currentChallenge: null,
  correct: number,
  streak: number,
  answered: boolean,
  progressionStep: 'guided' | 'practice' | 'challenge',
  achievements: string[]
};
```

Reglas nuevas:
- `activity` acepta ahora `add` y `subtract`.
- `mode` apunta a una tecnica valida para la actividad activa.
- `progressionStep` regula el grado de ayuda, no solo la dificultad numerica.

### 2.2 `ArithmeticChallenge`

Contrato para retos de suma y resta:

```js
{
  activity: 'add' | 'subtract',
  prompt: string,
  left: { numerator: number, denominator: number },
  right: { numerator: number, denominator: number },
  operator: '+' | '−',
  technique: 'same-denominator' | 'different-denominator' | 'cross-equalize',
  options: Array<{ key: string, label: string, plainLabel: string, value: string }>,
  correctOptionKey: string,
  hint: string,
  explanation: string,
  difficulty: 'guided' | 'practice' | 'challenge'
}
```

Reglas:
- La respuesta correcta puede no estar simplificada si la tecnica del reto se centra en operar primero.
- `explanation` debe decir claramente que tecnica se uso: mismo denominador, igualacion o multiplicacion cruzada.
- En `guided`, los ejemplos usan numeros pequenos y ayudas mas explicitas.

### 2.3 `TechniqueGuide`

Estructura por actividad:

```js
{
  add: {
    modes: ['same-denominator', 'different-denominator', 'cross-equalize'],
    guideCards: [...]
  },
  subtract: {
    modes: ['same-denominator', 'different-denominator', 'cross-equalize'],
    guideCards: [...]
  }
}
```

Mensajes esperados:
- **Mismo denominador:** suma o resta solo los numeradores.
- **Distinto denominador:** busca un denominador comun.
- **Multiplicacion cruzada para igualar:** multiplica cada fraccion por el numero que le falta abajo.

## 3. REST contracts (RULE-006)

No aplica.

Toda la funcionalidad sigue en cliente, sin nuevos endpoints HTTP.

## 4. Kafka contracts (RULE-007, RULE-010)

No aplica.

No existen eventos, colas ni contratos externos en esta feature.

## 5. Persistence model (RULE-008)

No aplica.

No se introduce persistencia adicional; suma y resta reutilizan el estado en memoria del laboratorio.

## 6. Saga design (RULE-009) — _if applicable_

No aplica.

No existe orquestacion transaccional en esta app.

## 7. Configuration (RULE-014)

Configuracion funcional prevista en `app.js`:

```js
const addSubtractModes = {
  add: ['same-denominator', 'different-denominator', 'cross-equalize'],
  subtract: ['same-denominator', 'different-denominator', 'cross-equalize']
};

const guidedDenominatorLimits = {
  guided: 6,
  practice: 8,
  challenge: 12
};
```

Tabla funcional:

| Property | Default | Required | Profile | Scope |
|----------|---------|---------:|---------|-------|
| `addSubtractModes.add` | `same,different,cross` | yes | all | tecnicas de suma |
| `addSubtractModes.subtract` | `same,different,cross` | yes | all | tecnicas de resta |
| `guidedDenominatorLimits.guided` | `6` | yes | all | numeros pequenos con apoyo alto |
| `guidedDenominatorLimits.practice` | `8` | yes | all | paso intermedio |
| `guidedDenominatorLimits.challenge` | `12` | yes | all | nivel alto con menos apoyo |

## 8. Module dependency graph

```
index.html
   ├── activity navigation
   ├── scoreboard + technique + level
   └── learning guide / challenge surface

app.js
   ├── activity registry
   ├── technique registry
   ├── add/subtract challenge generators
   ├── denominator equalization explanations
   ├── answer evaluator
   └── achievement / progression manager

styles.css
   ├── activity layout
   ├── challenge / option layout
   └── guide / hint emphasis
```

Reglas:
- `index.html` declara la misma superficie principal del laboratorio.
- `app.js` concentra la logica de suma/resta igual que ya hace para las otras actividades.
- `styles.css` solo acompana visualmente; no define tecnicas ni reglas.

## 9. Test design (guidance for `/sdd-tasks`)

Se mantiene enfoque de verificacion manual estructurada:

| REQ | Test type | Lives in | Asserts |
|-----|-----------|----------|---------|
| REQ-001 | manual UI | navegador local | existe actividad de suma funcional |
| REQ-002 | manual UI | navegador local | existe actividad de resta funcional |
| REQ-003 | manual content | navegador local | tecnicas y ayudas cambian segun la operacion |
| REQ-004 | manual functional | navegador local | aparecen retos de mismo y distinto denominador con igualacion guiada |
| REQ-005 | manual functional | navegador local | las respuestas siguen siendo opciones guiadas |
| REQ-006 | manual content | navegador local | el criterio principal de acierto no exige simplificacion final |
| REQ-007 | manual UX | navegador local | las pistas explican la tecnica usada de forma clara |
| REQ-008 | manual regression | navegador local | marcador, logros y niveles siguen integrados |
| REQ-009 | manual UX | navegador local y movil | el flujo se entiende y no abruma |
| REQ-010 | inspection | codigo + UI | la estructura admite futuras tecnicas complejas sin rehacer la app |

## 10. Skipped sections (with justification)

- `REST contracts` — _(reason: no hay backend ni endpoints)_
- `Kafka contracts` — _(reason: no hay mensajeria ni eventos)_
- `Persistence model` — _(reason: no hay nueva persistencia)_
- `Saga design` — _(reason: no aplica a una app frontend estatica)_
- `data-model.md` — _(reason: no hay persistencia, DTOs externos ni esquemas formales que justifiquen un documento separado)_

## 11. Open questions

| Question | Impact (PRD/Plan/Design) | Decider | Due |
|---------|--------------------------|---------|-----|
| Ninguna por ahora. | none | Luis Quiroga | resuelto 2026-08-08 |

## Definition of Done (Design)

- [x] Every REQ-NNN from the PRD maps to ≥1 section (model/REST/Kafka/...).
- [x] Every section either has content or appears in §10 with justification.
- [x] All constitutional rules touched are cited by stable RULE-ID.
- [x] All DTOs are records (RULE-015); all production classes are final-ready.
- [x] All Kafka payloads have an Avro schema referenced (RULE-007).
- [x] Every event-emitting aggregate has an outbox entry referenced (RULE-008).
- [x] Every `SagaStep<T>` (if any) has process + rollback semantics defined (RULE-009).
- [ ] Module dependency graph has no cycles and matches RULE-004.
- [x] Configuration uses canonical prefixes (RULE-014).
- [x] Test design maps every REQ-NNN to a concrete test home.
- [x] Open questions explicitly listed (or "none").
- [x] [`data-model.md`](data-model.md) cross-references resolved (every §
      that delegates field detail points at the right `data-model.md` §).

Note: the unchecked RULE-004 item is intentional because this repository is a
frontend laboratory and not an `lg5-spring` microservice with the canonical
backend module shape.
