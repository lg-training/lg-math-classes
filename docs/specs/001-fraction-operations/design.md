---
kind: design
name: fraction-operations
version: 0.1.0
description: Diseno detallado del laboratorio base de fracciones para actividades de comparacion, multiplicacion y division.
---

# Design — `fraction-operations`

## 1. Scope and boundaries

Este diseno cubre la evolucion del frontend actual desde una experiencia unica de comparacion hacia un laboratorio base de fracciones con multiples actividades. Se limita al cliente web/PWA actual, sin persistencia remota ni backend.

- **In design**:
  - `index.html` como contenedor principal de identidad, navegacion por actividades, marcador y area de reto. Cubre REQ-001, REQ-002, REQ-004, REQ-014.
  - `app.js` como motor de actividades, generacion de retos, opciones, evaluacion, simplificacion, logros y progreso. Cubre REQ-003, REQ-005, REQ-006, REQ-007, REQ-008, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013.
  - `styles.css` como soporte visual responsivo, jerarquia pedagogica y feedback motivacional. Cubre REQ-004, REQ-012, REQ-013.
  - `service-worker.js` y `manifest.webmanifest` solo si se requiere actualizar textos o cache de nuevos assets.
- **Out of design**:
  - Persistencia de progreso entre sesiones.
  - Nuevos dominios matematicos fuera de fracciones.
  - Escritura libre de respuestas.

## 2. Domain model (sketch)

> No hay dominio backend ni entidades persistentes. Aqui “modelo” significa objetos de estado y tipos funcionales del frontend.

| Aggregate | Module | Invariants (1-liner) | Detailed in |
|-----------|--------|----------------------|-------------|
| `LabState` | `app.js` | Solo una actividad activa y un reto activo a la vez. | `design.md §2.1` |
| `Challenge` | `app.js` | Todo reto tiene enunciado, respuesta correcta, opciones y explicacion. | `design.md §2.2` |
| `AchievementState` | `app.js` | Los hitos se desbloquean segun reglas deterministas de progreso. | `design.md §2.3` |

### 2.1 `LabState`

Objeto central en memoria:

```js
const state = {
  activity: 'compare',
  compareMode: 'mixed',
  currentChallenge: null,
  correct: 0,
  streak: 0,
  answered: false,
  achievements: [],
  progressionStep: 'guided'
};
```

Reglas:
- `activity` solo puede ser `compare | multiply | divide`.
- `currentChallenge` cambia solo al cargar nuevo reto.
- `answered` bloquea doble respuesta hasta `Nueva pregunta`.

### 2.2 `Challenge`

Contrato comun para toda actividad:

```js
{
  activity: 'compare' | 'multiply' | 'divide',
  prompt: string,
  left?: { numerator: number, denominator: number },
  right?: { numerator: number, denominator: number },
  operator?: '×' | '÷',
  options: Array<{ key: string, label: string, value: unknown }>,
  correctOptionKey: string,
  hint: string,
  explanation: string,
  difficulty: 'guided' | 'practice' | 'challenge'
}
```

Reglas:
- Toda actividad usa el mismo flujo de respuesta.
- `options` siempre contiene respuestas plausibles; una sola correcta.
- En multiplicacion y division, la correcta debe reflejar simplificacion si aplica.

### 2.3 `AchievementState`

Modelo ligero para medallas e hitos:

```js
{
  unlocked: Array<string>,
  lastUnlocked?: string,
  milestones: {
    firstCorrect: boolean,
    streak3: boolean,
    streak5: boolean,
    simplifyMaster: boolean,
    explorer: boolean
  }
}
```

Logros iniciales propuestos:
- `Primer acierto`
- `Racha de 3`
- `Racha de 5`
- `Super simplificador`
- `Explorador de fracciones`

## 3. REST contracts (RULE-006)

No aplica.

Esta feature no introduce endpoints HTTP ni intercambio con servidor; toda la logica vive en cliente.

## 4. Kafka contracts (RULE-007, RULE-010)

No aplica.

Esta feature no publica ni consume eventos, ni usa colas, ni contratos externos.

## 5. Persistence model (RULE-008)

No aplica.

No se introduce persistencia local ni remota en esta fase. El progreso, puntuacion y logros viven solo en memoria de sesion.

## 6. Saga design (RULE-009) — _if applicable_

No aplica.

No existe orquestacion transaccional ni procesos compensables en esta app.

## 7. Configuration (RULE-014)

Configuracion funcional minima hardcodeada en `app.js` para esta fase:

```js
const activities = ['compare', 'multiply', 'divide'];

const progressionRules = {
  guided: { maxDenominator: 6, allowSimpleOptions: true },
  practice: { maxDenominator: 9, allowSimpleOptions: true },
  challenge: { maxDenominator: 12, allowSimpleOptions: false }
};

const achievementRules = {
  firstCorrect: 1,
  streak3: 3,
  streak5: 5
};
```

Tabla de configuraciones funcionales:

| Property | Default | Required | Profile | Scope |
|----------|---------|---------:|---------|-------|
| `activities` | `compare,multiply,divide` | yes | all | actividades habilitadas |
| `progressionRules.guided.maxDenominator` | `6` | yes | all | dificultad inicial |
| `progressionRules.practice.maxDenominator` | `9` | yes | all | practica intermedia |
| `progressionRules.challenge.maxDenominator` | `12` | yes | all | reto alto |
| `achievementRules.streak3` | `3` | yes | all | medalla por racha |

## 8. Module dependency graph

```
index.html
   ├── renders activity navigation
   ├── renders scoreboard + achievements
   └── hosts challenge surface

app.js
   ├── activity registry
   ├── challenge generators
   ├── option builder
   ├── answer evaluator
   ├── simplification helper
   └── achievement/progression manager

styles.css
   ├── layout and responsive shell
   ├── activity controls
   ├── challenge cards and option states
   └── achievement visuals
```

Dependencias justificadas:
- `index.html` define la estructura declarativa.
- `app.js` es el unico modulo de comportamiento.
- `styles.css` no contiene logica; solo consume clases de estado emitidas por `app.js`.

## 9. Test design (guidance for `/sdd-tasks`)

Como no existe suite automatizada, esta fase define verificaciones manuales estructuradas y deja abierta la opcion de introducir tests JS ligeros mas adelante.

| REQ | Test type | Lives in | Asserts |
|-----|-----------|----------|---------|
| REQ-001 | manual UI | navegador local | la portada presenta la app como practica de fracciones, no solo comparador |
| REQ-002 | manual UI | navegador local | el usuario cambia entre comparar, multiplicar y dividir |
| REQ-003 | manual functional | navegador local | cada actividad cambia el tipo de reto y la forma de responder |
| REQ-004 | manual UX | navegador local y movil | textos cortos, botones grandes y flujo claro |
| REQ-005 | manual regression | navegador local | comparacion sigue funcionando correctamente |
| REQ-006 | manual functional | navegador local | multiplicacion muestra opciones y valida el acierto |
| REQ-007 | manual functional | navegador local | division muestra opciones y valida el acierto |
| REQ-008 | manual functional | navegador local | la opcion correcta en operaciones coincide con la forma simplificada |
| REQ-009 | manual content | navegador local | la pista y explicacion corresponden a la actividad y simplificacion |
| REQ-010 | manual regression | navegador local | el marcador global se actualiza desde cualquier actividad |
| REQ-011 | manual regression | navegador local | tras responder, no se avanza hasta pulsar nueva pregunta |
| REQ-012 | manual UX | navegador local | aparecen medallas, logros o mensajes al alcanzar hitos |
| REQ-013 | manual UX | navegador local | la dificultad y ayudas se perciben graduales |
| REQ-014 | inspection | codigo + UI | la estructura separa actividades y permite ampliar luego |

## 10. Skipped sections (with justification)

- `REST contracts` — _(reason: no hay backend ni endpoints en esta feature)_
- `Kafka contracts` — _(reason: no existen eventos ni colas en esta app)_
- `Persistence model` — _(reason: no se introduce estado persistente en esta fase)_
- `Saga design` — _(reason: no hay procesos distribuidos ni transacciones)_
- `data-model.md` — _(reason: este frontend no introduce persistencia, DTOs externos ni esquemas formales; el detalle cabe de forma suficiente en `design.md`)_

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
frontend laboratory, not an `lg5-spring` microservice with the canonical
backend module shape.
