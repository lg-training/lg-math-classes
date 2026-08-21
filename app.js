const ACTIVITY_KEYS = ['compare', 'multiply', 'divide', 'add', 'subtract', 'proper-improper'];

// Medallas con id estable: el texto visible puede cambiar sin borrar el progreso guardado.
const ACHIEVEMENTS = {
  'first-correct': 'Primer acierto',
  'streak-3': 'Racha de 3',
  'streak-5': 'Racha de 5',
  'super-simplifier': 'Super simplificador',
  'denominator-matcher': 'Igualador de denominadores',
  'mixed-master': 'Maestro de mixtas',
  'fraction-explorer': 'Explorador de fracciones',
};

// Mapa de compatibilidad: progreso guardado antes de usar ids.
const LEGACY_ACHIEVEMENTS = Object.entries(ACHIEVEMENTS).reduce((map, [id, label]) => {
  map[label] = id;
  return map;
}, {});

function createActivityStats() {
  return ACTIVITY_KEYS.reduce((stats, key) => {
    stats[key] = { correct: 0, attempts: 0, bestStreak: 0 };
    return stats;
  }, {});
}

const state = {
  activity: 'compare',
  mode: 'mixed',
  currentChallenge: null,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  answered: false,
  progressionStep: 'guided',
  achievements: [],
  byActivity: createActivityStats(),
  xp: 0,
  daysPlayed: 0,
  lastPlayDay: '',
  dayStreak: 0,
  bestDayStreak: 0,
  missions: null,
  grades: {},
  seenGrades: 0,
};

const STORAGE_KEY = 'mgFracciones.v1';

function loadProgress() {
  let saved = null;

  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (error) {
    saved = null;
  }

  if (!saved || typeof saved !== 'object') {
    return;
  }

  state.correct = Number.isFinite(saved.correct) ? saved.correct : 0;
  state.streak = Number.isFinite(saved.streak) ? saved.streak : 0;
  state.bestStreak = Number.isFinite(saved.bestStreak) ? saved.bestStreak : state.streak;
  state.xp = Number.isFinite(saved.xp) ? saved.xp : 0;
  state.daysPlayed = Number.isFinite(saved.daysPlayed) ? saved.daysPlayed : 0;
  state.lastPlayDay = typeof saved.lastPlayDay === 'string' ? saved.lastPlayDay : '';
  state.dayStreak = Number.isFinite(saved.dayStreak) ? saved.dayStreak : 0;
  state.bestDayStreak = Number.isFinite(saved.bestDayStreak) ? saved.bestDayStreak : 0;
  state.seenGrades = Number.isFinite(saved.seenGrades) ? saved.seenGrades : 0;
  if (saved.grades && typeof saved.grades === 'object') {
    state.grades = saved.grades;
  }
  if (saved.missions && typeof saved.missions === 'object' && Array.isArray(saved.missions.list)) {
    state.missions = saved.missions;
  }

  if (Array.isArray(saved.achievements)) {
    // Acepta ids nuevos y nombres antiguos guardados como texto.
    state.achievements = saved.achievements
      .map((entry) => (ACHIEVEMENTS[entry] ? entry : LEGACY_ACHIEVEMENTS[entry]))
      .filter((id, index, list) => id && list.indexOf(id) === index);
  }

  if (saved.byActivity && typeof saved.byActivity === 'object') {
    ACTIVITY_KEYS.forEach((key) => {
      const entry = saved.byActivity[key];
      if (!entry || typeof entry !== 'object') {
        return;
      }
      state.byActivity[key] = {
        correct: Number.isFinite(entry.correct) ? entry.correct : 0,
        attempts: Number.isFinite(entry.attempts) ? entry.attempts : 0,
        bestStreak: Number.isFinite(entry.bestStreak) ? entry.bestStreak : 0,
      };
    });
  }

  if (ACTIVITY_KEYS.includes(saved.activity)) {
    state.activity = saved.activity;
  }

  if (typeof saved.mode === 'string') {
    state.mode = saved.mode;
  }

  if (typeof saved.progressionStep === 'string') {
    state.progressionStep = saved.progressionStep;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        activity: state.activity,
        mode: state.mode,
        correct: state.correct,
        streak: state.streak,
        bestStreak: state.bestStreak,
        xp: state.xp,
        daysPlayed: state.daysPlayed,
        lastPlayDay: state.lastPlayDay,
        dayStreak: state.dayStreak,
        bestDayStreak: state.bestDayStreak,
        missions: state.missions,
        grades: state.grades,
        seenGrades: state.seenGrades,
        progressionStep: state.progressionStep,
        achievements: state.achievements,
        byActivity: state.byActivity,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    // Modo privado o almacenamiento lleno: la partida sigue, solo no se guarda.
  }
}

const modeLabelMap = {
  mixed: 'Mixto',
  'same-denominator': 'Mismo denominador',
  'same-numerator': 'Mismo numerador',
  cross: 'Multiplica en cruz',
  'multiply-basic': 'Multiplica arriba y abajo',
  'multiply-simplify': 'Simplifica al final',
  'multiply-challenge': 'Reto de simplificacion',
  'divide-flip': 'Da la vuelta a la segunda',
  'divide-simplify': 'Divide y simplifica',
  'divide-challenge': 'Reto de simplificacion',
  'add-same-denominator': 'Mismo denominador',
  'add-different-denominator': 'Distinto denominador',
  'add-cross-equalize': 'Iguala con multiplicacion cruzada',
  'subtract-same-denominator': 'Mismo denominador',
  'subtract-different-denominator': 'Distinto denominador',
  'subtract-cross-equalize': 'Iguala con multiplicacion cruzada',
  'proper-improper-mixed': 'Preguntas mezcladas',
  'proper-improper-identify': 'Distingue el tipo',
  'improper-to-mixed': 'Impropia a mixta',
  'mixed-to-improper': 'Mixta a impropia',
};

const levelLabelMap = {
  guided: 'Guiado',
  practice: 'Practica',
  challenge: 'Desafio',
};

const progressionRules = {
  guided: { maxDenominator: 6, maxNumerator: 6 },
  practice: { maxDenominator: 9, maxNumerator: 8 },
  challenge: { maxDenominator: 12, maxNumerator: 9 },
};

const activityContent = {
  compare: {
    kicker: 'Comparar fracciones',
    title: 'Escoge un tipo de reto',
    description: 'Busca la fraccion mayor con ayuda visual y pistas cortas.',
    defaultMode: 'mixed',
    modes: [
      { key: 'mixed', label: 'Mixto' },
      { key: 'same-denominator', label: 'Mismo denominador' },
      { key: 'same-numerator', label: 'Mismo numerador' },
      { key: 'cross', label: 'Multiplica en cruz' },
    ],
    guide: {
      title: 'Tecnicas para comparar',
      cards: [
        {
          title: 'Mismo denominador',
          text: 'Si abajo es igual, gana el numerador mayor.',
        },
        {
          title: 'Mismo numerador',
          text: 'Si arriba es igual, gana el denominador menor.',
        },
        {
          title: 'En cruz',
          text: 'Si todo cambia, multiplica en cruz y compara los productos.',
        },
      ],
    },
  },
  multiply: {
    kicker: 'Multiplicar fracciones',
    title: 'Resuelve y simplifica',
    description: 'Multiplica arriba con arriba y abajo con abajo. Luego simplifica.',
    defaultMode: 'multiply-basic',
    modes: [
      { key: 'multiply-basic', label: 'Arriba y abajo' },
      { key: 'multiply-simplify', label: 'Simplifica al final' },
      { key: 'multiply-challenge', label: 'Reto' },
    ],
    guide: {
      title: 'Tecnicas para multiplicar',
      cards: [
        {
          title: 'Paso 1',
          text: 'Multiplica numerador con numerador y denominador con denominador.',
        },
        {
          title: 'Paso 2',
          text: 'Mira si puedes sacar mitad, tercera o quinta para simplificar.',
        },
        {
          title: 'Nivel alto',
          text: 'Busca factores comunes sin que te lo digan: mitad, tercera, quinta y mas.',
        },
      ],
    },
  },
  divide: {
    kicker: 'Dividir fracciones',
    title: 'Invierte y multiplica',
    description: 'Da la vuelta a la segunda fraccion, multiplica y simplifica.',
    defaultMode: 'divide-flip',
    modes: [
      { key: 'divide-flip', label: 'Da la vuelta' },
      { key: 'divide-simplify', label: 'Simplifica' },
      { key: 'divide-challenge', label: 'Reto' },
    ],
    guide: {
      title: 'Tecnicas para dividir',
      cards: [
        {
          title: 'Paso 1',
          text: 'Invierte solo la segunda fraccion.',
        },
        {
          title: 'Paso 2',
          text: 'Despues multiplica como en la actividad de multiplicar.',
        },
        {
          title: 'Nivel alto',
          text: 'Simplifica pensando en factores comunes: mitad, tercera, quinta o mas.',
        },
      ],
    },
  },
  add: {
    kicker: 'Sumar fracciones',
    title: 'Suma con tecnica guiada',
    description: 'Aprende a sumar con mismo denominador o igualando denominadores paso a paso.',
    defaultMode: 'add-same-denominator',
    modes: [
      { key: 'add-same-denominator', label: 'Mismo denominador' },
      { key: 'add-different-denominator', label: 'Distinto denominador' },
      { key: 'add-cross-equalize', label: 'Iguala denominadores' },
    ],
    guide: {
      title: 'Tecnicas para sumar',
      cards: [
        {
          title: 'Mismo denominador',
          text: 'Si abajo es igual, suma solo los numeradores.',
        },
        {
          title: 'Distinto denominador',
          text: 'Busca un denominador comun antes de sumar.',
        },
        {
          title: 'Igualacion guiada',
          text: 'Multiplica cada fraccion por lo que le falta abajo para igualar.',
        },
      ],
    },
  },
  subtract: {
    kicker: 'Restar fracciones',
    title: 'Resta con tecnica guiada',
    description: 'Aprende a restar con mismo denominador o igualando denominadores paso a paso.',
    defaultMode: 'subtract-same-denominator',
    modes: [
      { key: 'subtract-same-denominator', label: 'Mismo denominador' },
      { key: 'subtract-different-denominator', label: 'Distinto denominador' },
      { key: 'subtract-cross-equalize', label: 'Iguala denominadores' },
    ],
    guide: {
      title: 'Tecnicas para restar',
      cards: [
        {
          title: 'Mismo denominador',
          text: 'Si abajo es igual, resta solo los numeradores.',
        },
        {
          title: 'Distinto denominador',
          text: 'Busca un denominador comun antes de restar.',
        },
        {
          title: 'Igualacion guiada',
          text: 'Usa multiplicacion cruzada para llevar las dos fracciones al mismo denominador.',
        },
      ],
    },
  },
  'proper-improper': {
    kicker: 'Propias e impropias',
    title: 'Reconoce y convierte',
    description: 'Mezcla preguntas para distinguir fracciones propias, impropias y numeros mixtos.',
    defaultMode: 'proper-improper-mixed',
    modes: [
      { key: 'proper-improper-mixed', label: 'Mixto' },
      { key: 'proper-improper-identify', label: 'Identificar' },
      { key: 'improper-to-mixed', label: 'A numero mixto' },
      { key: 'mixed-to-improper', label: 'A impropia' },
    ],
    guide: {
      title: 'Tecnicas para propias e impropias',
      sections: [
        {
          cards: [
            {
              title: 'Fraccion propia',
              text: 'El numerador es menor que el denominador.',
            },
            {
              title: 'Fraccion impropia',
              text: 'El numerador es mayor o igual que el denominador.',
            },
            {
              title: 'Numero mixto',
              text: 'Tiene figuras completas y una fraccion con las partes que sobran.',
            },
            {
              title: 'Lee una mixta',
              text: 'Primero lee el entero y despues la fraccion: 2 1/3 se lee dos enteros y un tercio.',
            },
          ],
        },
        {
          title: 'Tecnicas para dibujar',
          cards: [
            {
              title: 'Dibuja una propia',
              text: 'Dibuja una figura, dividela en partes iguales y pinta menos partes de las que hay abajo.',
            },
            {
              title: 'Dibuja una impropia',
              text: 'Dibuja figuras iguales completas hasta pintar todas las partes que dice el numerador.',
            },
            {
              title: 'Dibuja una mixta',
              text: 'Dibuja las figuras completas y despues otra figura con las partes que sobran.',
            },
          ],
        },
      ],
    },
  },
};

const promptText = document.getElementById('promptText');
const feedbackBox = document.getElementById('feedbackBox');
const correctCount = document.getElementById('correctCount');
const streakCount = document.getElementById('streakCount');
const modeLabel = document.getElementById('modeLabel');
const hintButton = document.getElementById('hintButton');
const nextButton = document.getElementById('nextButton');
const activityButtons = Array.from(document.querySelectorAll('.activity-button'));
const answerOptions = document.getElementById('answerOptions');
const operationPreview = document.getElementById('operationPreview');
const controlsKicker = document.getElementById('controlsKicker');
const controlsTitle = document.getElementById('controlsTitle');
const controlsDescription = document.getElementById('controlsDescription');
const modeControls = document.getElementById('modeControls');
const achievementList = document.getElementById('medalGrid');
const medalGrid = achievementList;
const vaultBtn = document.getElementById('vaultBtn');
const vaultBadge = document.getElementById('vaultBadge');
const vault = document.getElementById('vault');
const vGot = document.getElementById('vGot');
const vAll = document.getElementById('vAll');
const vBar = document.getElementById('vBar');
const vMetals = document.getElementById('vMetals');
const chest = document.getElementById('chest');
const show = document.getElementById('show');
const showGrid = document.getElementById('showGrid');
const showTitle = document.getElementById('showTitle');
const showFoot = document.getElementById('showFoot');
const skipHint = document.getElementById('skipHint');
const bigChest = document.getElementById('bigChest');
const showToVault = document.getElementById('showToVault');
const showClose = document.getElementById('showClose');
const questBtn = document.getElementById('questBtn');
const questBadge = document.getElementById('questBadge');
const quests = document.getElementById('quests');
const misDay = document.getElementById('misDay');
const misList = document.getElementById('misList');
const toastHost = document.getElementById('toastHost');
const rankName = document.getElementById('rankName');
const rankLevel = document.getElementById('rankLevel');
const rankFill = document.getElementById('rankFill');
const rankBar = document.getElementById('rankBar');
const rankHint = document.getElementById('rankHint');
const activityLabel = document.getElementById('activityLabel');
const levelLabel = document.getElementById('levelLabel');
const techniqueChip = document.getElementById('techniqueChip');
const guideTitle = document.getElementById('guideTitle');
const guideGrid = document.getElementById('guideGrid');

function updateActionLabels() {
  if (state.answered) {
    hintButton.textContent = 'Ver explicacion';
    nextButton.textContent = 'Nueva pregunta';
    promptText.textContent = 'Pulsa "Nueva pregunta" para seguir';
    return;
  }

  hintButton.textContent = 'Ver pista';
  nextButton.textContent = 'Siguiente';

  if (state.activity === 'compare') {
    promptText.textContent = 'Toca la fraccion mayor';
    return;
  }

  if (state.activity === 'proper-improper') {
    promptText.textContent = state.currentChallenge ? state.currentChallenge.prompt : 'Elige la respuesta correcta';
    return;
  }

  promptText.textContent = 'Elige la respuesta correcta';
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

function fractionToText(fraction) {
  return `${fraction.numerator}/${fraction.denominator}`;
}

function buildFractionMarkup(numerator, denominator) {
  return `
    <span class="fraction" aria-label="${numerator} partido ${denominator}">
      <span class="pizza-wrap" aria-hidden="true">
        ${buildFractionVisualMarkup(numerator, denominator)}
      </span>
      <span>${numerator}</span>
      <span class="line"></span>
      <span>${denominator}</span>
    </span>
  `;
}

function buildCompactFractionMarkup(numerator, denominator) {
  return `
    <span class="fraction fraction-compact" aria-label="${numerator} partido ${denominator}">
      <span>${numerator}</span>
      <span class="line"></span>
      <span>${denominator}</span>
    </span>
  `;
}

function buildMixedNumberMarkup(whole, numerator, denominator) {
  return `
    <span class="mixed-number" aria-label="${whole} enteros y ${numerator} partido ${denominator}">
      <span class="mixed-whole">${whole}</span>
      ${buildCompactFractionMarkup(numerator, denominator)}
    </span>
  `;
}

function buildTextOptionMarkup(text, note = '') {
  return `
    <span class="text-option">
      <strong>${text}</strong>
      ${note ? `<small>${note}</small>` : ''}
    </span>
  `;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createSlicePath(startAngle, endAngle) {
  const start = polarToCartesian(50, 50, 44, endAngle);
  const end = polarToCartesian(50, 50, 44, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [`M 50 50`, `L ${start.x} ${start.y}`, `A 44 44 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, 'Z'].join(' ');
}

function buildPizzaMarkup(numerator, denominator) {
  const slices = [];
  const step = 360 / denominator;

  for (let index = 0; index < denominator; index += 1) {
    const startAngle = index * step;
    const endAngle = startAngle + step;
    const isFilled = index < numerator;

    slices.push(`
      <path
        d="${createSlicePath(startAngle, endAngle)}"
        fill="${isFilled ? '#f97316' : '#fff7ed'}"
        stroke="#17324d"
        stroke-width="2"
        stroke-linejoin="round"
      ></path>
    `);
  }

  return `
    <svg class="pizza" viewBox="0 0 100 100" role="img" aria-label="Pizza con ${numerator} trozos pintados de ${denominator}">
      <circle cx="50" cy="50" r="44" fill="#ffffff"></circle>
      ${slices.join('')}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#17324d" stroke-width="2.5"></circle>
    </svg>
  `;
}

function buildFractionVisualMarkup(numerator, denominator) {
  if (numerator <= denominator) {
    return buildPizzaMarkup(numerator, denominator);
  }

  const wholeCount = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  const pizzas = [];

  for (let index = 0; index < wholeCount; index += 1) {
    pizzas.push(buildPizzaMarkup(denominator, denominator));
  }

  if (remainder > 0) {
    pizzas.push(buildPizzaMarkup(remainder, denominator));
  }

  return `<span class="pizza-stack">${pizzas.join('')}</span>`;
}

function getDifficultyConfig() {
  return progressionRules[state.progressionStep];
}

function getModeLabel() {
  return modeLabelMap[state.mode] || 'Tecnica libre';
}

function setProgressionStep() {
  if (state.correct >= 10 || state.streak >= 5) {
    state.progressionStep = 'challenge';
    return;
  }

  if (state.correct >= 4) {
    state.progressionStep = 'practice';
    return;
  }

  state.progressionStep = 'guided';
}

function getTechniqueLabel() {
  return modeLabelMap[state.mode] || 'Tecnica libre';
}

function getSimplificationHint(fraction) {
  const divisors = [2, 3, 5, 4, 6, 7, 8, 9, 10];
  const matchingDivisor = divisors.find(
    (divisor) => fraction.numerator % divisor === 0 && fraction.denominator % divisor === 0
  );

  if (!matchingDivisor) {
    return 'Mira si arriba y abajo comparten algun numero para simplificar.';
  }

  const divisorLabels = {
    2: 'saca mitad',
    3: 'prueba tercera',
    4: 'prueba cuarta',
    5: 'prueba quinta',
    6: 'prueba sexta',
    7: 'prueba septima',
    8: 'prueba octava',
    9: 'prueba novena',
    10: 'prueba decima',
  };

  return `Tip: ${divisorLabels[matchingDivisor]}. ${fraction.numerator} y ${fraction.denominator} se pueden dividir entre ${matchingDivisor}.`;
}

function shouldUseAdvancedSimplificationTips() {
  return state.progressionStep === 'challenge';
}

function buildCompareOption(side, fraction) {
  return {
    key: side,
    label: buildFractionMarkup(fraction.numerator, fraction.denominator),
    plainLabel: side === 'left' ? 'La izquierda' : 'La derecha',
  };
}

function buildChoiceOption(key, label, plainLabel) {
  return {
    key,
    value: key,
    label,
    plainLabel,
  };
}

function createSameDenominatorChallenge() {
  const { maxDenominator } = getDifficultyConfig();
  const denominator = randomInt(3, maxDenominator);
  let leftNumerator = randomInt(1, denominator - 1);
  let rightNumerator = randomInt(1, denominator - 1);

  while (leftNumerator === rightNumerator) {
    rightNumerator = randomInt(1, denominator - 1);
  }

  const left = { numerator: leftNumerator, denominator };
  const right = { numerator: rightNumerator, denominator };
  const correctSide = left.numerator > right.numerator ? 'left' : 'right';

  return {
    activity: 'compare',
    prompt: 'Toca la fraccion mayor',
    options: [buildCompareOption('left', left), buildCompareOption('right', right)],
    correctOptionKey: correctSide,
    hint: 'Mismo denominador: gana el numerador mayor.',
    explanation: `Como las dos tienen ${denominator} abajo, solo miramos arriba: ${leftNumerator} y ${rightNumerator}.`,
    difficulty: state.progressionStep,
  };
}

function createSameNumeratorChallenge() {
  const { maxDenominator, maxNumerator } = getDifficultyConfig();
  const numerator = randomInt(1, Math.min(6, maxNumerator, maxDenominator - 2));
  let leftDenominator = randomInt(numerator + 1, maxDenominator);
  let rightDenominator = randomInt(numerator + 1, maxDenominator);

  while (leftDenominator === rightDenominator) {
    rightDenominator = randomInt(numerator + 1, maxDenominator);
  }

  const left = { numerator, denominator: leftDenominator };
  const right = { numerator, denominator: rightDenominator };
  const correctSide = left.denominator < right.denominator ? 'left' : 'right';

  return {
    activity: 'compare',
    prompt: 'Toca la fraccion mayor',
    options: [buildCompareOption('left', left), buildCompareOption('right', right)],
    correctOptionKey: correctSide,
    hint: 'Mismo numerador: gana el denominador menor.',
    explanation: `Como las dos tienen ${numerator} arriba, gana la fraccion con menos partes abajo.`,
    difficulty: state.progressionStep,
  };
}

function createCrossChallenge() {
  const { maxDenominator, maxNumerator } = getDifficultyConfig();
  let left = null;
  let right = null;

  while (!left || !right) {
    const candidateLeft = {
      numerator: randomInt(1, maxNumerator),
      denominator: randomInt(2, maxDenominator),
    };
    const candidateRight = {
      numerator: randomInt(1, maxNumerator),
      denominator: randomInt(2, maxDenominator),
    };

    const sameNumerator = candidateLeft.numerator === candidateRight.numerator;
    const sameDenominator = candidateLeft.denominator === candidateRight.denominator;
    const equivalent = candidateLeft.numerator * candidateRight.denominator === candidateRight.numerator * candidateLeft.denominator;

    if (sameNumerator || sameDenominator || equivalent) {
      continue;
    }

    left = candidateLeft;
    right = candidateRight;
  }

  const leftCross = left.numerator * right.denominator;
  const rightCross = right.numerator * left.denominator;
  const correctSide = leftCross > rightCross ? 'left' : 'right';

  return {
    activity: 'compare',
    prompt: 'Toca la fraccion mayor',
    options: [buildCompareOption('left', left), buildCompareOption('right', right)],
    correctOptionKey: correctSide,
    hint: 'Todo diferente: multiplica en cruz.',
    explanation: `${left.numerator} × ${right.denominator} = ${leftCross} y ${right.numerator} × ${left.denominator} = ${rightCross}. Gana el producto mayor.`,
    difficulty: state.progressionStep,
  };
}

function generateDistractorFractions(correctFraction) {
  const distractors = [];
  const sameUnsimplified = {
    numerator: correctFraction.numerator * 2,
    denominator: correctFraction.denominator * 2,
  };
  const wrongNumerator = {
    numerator: Math.max(1, correctFraction.numerator + 1),
    denominator: correctFraction.denominator,
  };
  const wrongDenominator = {
    numerator: correctFraction.numerator,
    denominator: correctFraction.denominator + 1,
  };

  [sameUnsimplified, wrongNumerator, wrongDenominator].forEach((item) => {
    const text = fractionToText(item);
    if (text !== fractionToText(correctFraction) && !distractors.some((candidate) => fractionToText(candidate) === text)) {
      distractors.push(item);
    }
  });

  for (let offset = 1; distractors.length < 2 && offset <= 4; offset += 1) {
    const candidate = { numerator: correctFraction.numerator + offset, denominator: correctFraction.denominator + offset };
    const text = fractionToText(candidate);
    if (text !== fractionToText(correctFraction) && !distractors.some((item) => fractionToText(item) === text)) {
      distractors.push(candidate);
    }
  }

  return distractors.slice(0, 2);
}

function shuffle(array) {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildOperationOptions(correctFraction) {
  const correctText = fractionToText(correctFraction);
  const options = [
    {
      key: `option-${correctText}`,
      value: correctText,
      label: buildCompactFractionMarkup(correctFraction.numerator, correctFraction.denominator),
      plainLabel: correctText,
    },
  ];

  generateDistractorFractions(correctFraction).forEach((fraction) => {
    const text = fractionToText(fraction);
    options.push({
      key: `option-${text}`,
      value: text,
      label: buildCompactFractionMarkup(fraction.numerator, fraction.denominator),
      plainLabel: text,
    });
  });

  return shuffle(options);
}

function buildArithmeticOptions(correctFraction, rawFraction) {
  const correctText = fractionToText(correctFraction);
  const rawText = fractionToText(rawFraction);
  const options = [
    {
      key: `option-${rawText}`,
      value: rawText,
      label: buildCompactFractionMarkup(rawFraction.numerator, rawFraction.denominator),
      plainLabel: rawText,
    },
  ];

  if (correctText !== rawText) {
    options.push({
      key: `option-${correctText}`,
      value: correctText,
      label: buildCompactFractionMarkup(correctFraction.numerator, correctFraction.denominator),
      plainLabel: correctText,
    });
  }

  const distractors = [
    {
      numerator: Math.max(1, rawFraction.numerator + 1),
      denominator: rawFraction.denominator,
    },
    {
      numerator: Math.max(1, rawFraction.numerator - 1),
      denominator: rawFraction.denominator,
    },
    {
      numerator: rawFraction.numerator,
      denominator: rawFraction.denominator + 1,
    },
  ];

  distractors.forEach((fraction) => {
    const text = fractionToText(fraction);
    if (!options.some((option) => option.value === text) && options.length < 3) {
      options.push({
        key: `option-${text}`,
        value: text,
        label: buildCompactFractionMarkup(fraction.numerator, fraction.denominator),
        plainLabel: text,
      });
    }
  });

  while (options.length < 3) {
    const fraction = {
      numerator: Math.max(1, rawFraction.numerator + randomInt(1, 3)),
      denominator: Math.max(2, rawFraction.denominator + randomInt(0, 3)),
    };
    const text = fractionToText(fraction);
    if (!options.some((option) => option.value === text)) {
      options.push({
        key: `option-${text}`,
        value: text,
        label: buildCompactFractionMarkup(fraction.numerator, fraction.denominator),
        plainLabel: text,
      });
    }
  }

  return shuffle(options.slice(0, 3));
}

function buildImproperConversionOptions(correctMixed, sourceFraction) {
  const correctKey = `mixed-${correctMixed.whole}-${correctMixed.numerator}-${correctMixed.denominator}`;
  const options = [
    buildChoiceOption(
      correctKey,
      buildMixedNumberMarkup(correctMixed.whole, correctMixed.numerator, correctMixed.denominator),
      `${correctMixed.whole} ${correctMixed.numerator}/${correctMixed.denominator}`
    ),
  ];

  const distractors = [
    { whole: correctMixed.whole + 1, numerator: correctMixed.numerator, denominator: correctMixed.denominator },
    { whole: correctMixed.whole, numerator: Math.min(correctMixed.denominator - 1, correctMixed.numerator + 1), denominator: correctMixed.denominator },
    { whole: Math.max(1, correctMixed.whole - 1), numerator: sourceFraction.numerator - correctMixed.denominator, denominator: correctMixed.denominator },
  ];

  for (let wholeOffset = -2; wholeOffset <= 2; wholeOffset += 1) {
    for (let numerator = 1; numerator < correctMixed.denominator; numerator += 1) {
      distractors.push({
        whole: Math.max(1, correctMixed.whole + wholeOffset),
        numerator,
        denominator: correctMixed.denominator,
      });
    }
  }

  distractors.forEach((mixed) => {
    if (mixed.numerator <= 0 || mixed.numerator >= mixed.denominator) {
      return;
    }

    const key = `mixed-${mixed.whole}-${mixed.numerator}-${mixed.denominator}`;
    if (!options.some((option) => option.key === key) && options.length < 3) {
      options.push(buildChoiceOption(key, buildMixedNumberMarkup(mixed.whole, mixed.numerator, mixed.denominator), `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`));
    }
  });

  return {
    options: shuffle(options.slice(0, 3)),
    correctKey,
  };
}

function buildMixedConversionOptions(sourceMixed, correctFraction) {
  const correctText = fractionToText(correctFraction);
  const options = [
    buildChoiceOption(
      `fraction-${correctText}`,
      buildCompactFractionMarkup(correctFraction.numerator, correctFraction.denominator),
      correctText
    ),
  ];

  const distractors = [
    { numerator: sourceMixed.whole + sourceMixed.numerator, denominator: sourceMixed.denominator },
    { numerator: sourceMixed.whole * sourceMixed.denominator - sourceMixed.numerator, denominator: sourceMixed.denominator },
    { numerator: correctFraction.numerator + 1, denominator: correctFraction.denominator },
  ];

  for (let offset = -3; offset <= 3; offset += 1) {
    distractors.push({
      numerator: Math.max(1, correctFraction.numerator + offset),
      denominator: correctFraction.denominator,
    });
  }

  distractors.forEach((fraction) => {
    const text = fractionToText(fraction);
    const key = `fraction-${text}`;
    if (text !== correctText && !options.some((option) => option.key === key) && options.length < 3) {
      options.push(buildChoiceOption(key, buildCompactFractionMarkup(fraction.numerator, fraction.denominator), text));
    }
  });

  return {
    options: shuffle(options.slice(0, 3)),
    correctKey: `fraction-${correctText}`,
  };
}

function buildEqualizationExplanation(left, right, commonDenominator, leftMultiplier, rightMultiplier, newLeftNumerator, newRightNumerator, activity) {
  const actionWord = activity === 'add' ? 'sumamos' : 'restamos';
  return `Buscamos un denominador comun: ${commonDenominator}. Multiplicamos ${fractionToText(left)} por ${leftMultiplier}/${leftMultiplier} y ${fractionToText(right)} por ${rightMultiplier}/${rightMultiplier}. Quedan ${newLeftNumerator}/${commonDenominator} y ${newRightNumerator}/${commonDenominator}; ahora ${actionWord} los numeradores.`;
}

function createAddSubtractChallenge(activity) {
  const { maxDenominator, maxNumerator } = getDifficultyConfig();
  const sameMode = state.mode === `${activity}-same-denominator`;
  const crossMode = state.mode === `${activity}-cross-equalize`;

  let left = null;
  let right = null;
  let rawResult = null;
  let explanation = '';
  let hint = '';

  while (!left || !right || !rawResult) {
    if (sameMode) {
      const denominator = randomInt(2, maxDenominator);
      const leftNumerator = randomInt(1, maxNumerator);
      const rightNumerator = randomInt(1, maxNumerator);
      const resultNumerator = activity === 'add' ? leftNumerator + rightNumerator : leftNumerator - rightNumerator;

      if (resultNumerator <= 0) {
        continue;
      }

      left = { numerator: leftNumerator, denominator };
      right = { numerator: rightNumerator, denominator };
      rawResult = { numerator: resultNumerator, denominator };
      hint = activity === 'add'
        ? 'Mismo denominador: suma solo los numeradores.'
        : 'Mismo denominador: resta solo los numeradores.';
      explanation = `Como las dos fracciones tienen ${denominator} abajo, ${activity === 'add' ? 'sumamos' : 'restamos'} solo los numeradores: ${leftNumerator} ${activity === 'add' ? '+' : '−'} ${rightNumerator} = ${resultNumerator}.`;
      break;
    }

    left = {
      numerator: randomInt(1, maxNumerator),
      denominator: randomInt(2, maxDenominator),
    };
    right = {
      numerator: randomInt(1, maxNumerator),
      denominator: randomInt(2, maxDenominator),
    };

    if (left.denominator === right.denominator) {
      continue;
    }

    const commonDenominator = crossMode ? left.denominator * right.denominator : lcm(left.denominator, right.denominator);
    const leftMultiplier = commonDenominator / left.denominator;
    const rightMultiplier = commonDenominator / right.denominator;
    const newLeftNumerator = left.numerator * leftMultiplier;
    const newRightNumerator = right.numerator * rightMultiplier;
    const resultNumerator = activity === 'add' ? newLeftNumerator + newRightNumerator : newLeftNumerator - newRightNumerator;

    if (resultNumerator <= 0) {
      left = null;
      right = null;
      continue;
    }

    rawResult = {
      numerator: resultNumerator,
      denominator: commonDenominator,
    };

    hint = crossMode
      ? 'Multiplica cada fraccion por lo que le falta abajo para igualar los denominadores.'
      : 'Busca un denominador comun antes de operar.';

    explanation = buildEqualizationExplanation(
      left,
      right,
      commonDenominator,
      leftMultiplier,
      rightMultiplier,
      newLeftNumerator,
      newRightNumerator,
      activity
    );
  }

  const simplified = simplifyFraction(rawResult.numerator, rawResult.denominator);
  const options = buildArithmeticOptions(rawResult, simplified);
  const correctOption = options.find((option) => option.value === fractionToText(rawResult)) || options[0];

  return {
    activity,
    prompt: 'Elige la respuesta correcta',
    left,
    right,
    operator: activity === 'add' ? '+' : '−',
    options,
    correctOptionKey: correctOption.key,
    hint,
    explanation,
    difficulty: state.progressionStep,
    technique: state.mode,
  };
}

function createOperationChallenge(activity) {
  const { maxDenominator, maxNumerator } = getDifficultyConfig();

  let left = null;
  let right = null;
  let result = null;

  while (!left || !right || !result) {
    const candidateLeft = {
      numerator: randomInt(1, maxNumerator),
      denominator: randomInt(2, maxDenominator),
    };
    const candidateRight = {
      numerator: randomInt(1, maxNumerator),
      denominator: randomInt(2, maxDenominator),
    };

    if (activity === 'divide' && candidateRight.numerator === 0) {
      continue;
    }

    const rawResult = activity === 'multiply'
      ? { numerator: candidateLeft.numerator * candidateRight.numerator, denominator: candidateLeft.denominator * candidateRight.denominator }
      : { numerator: candidateLeft.numerator * candidateRight.denominator, denominator: candidateLeft.denominator * candidateRight.numerator };

    if (rawResult.denominator <= 0) {
      continue;
    }

    left = candidateLeft;
    right = candidateRight;
    result = simplifyFraction(rawResult.numerator, rawResult.denominator);
  }

  const options = buildOperationOptions(result);
  const correctOption = options.find((item) => item.value === fractionToText(result));
  const operationWord = activity === 'multiply' ? 'Multiplica' : 'Divide';
  const simplificationTip = shouldUseAdvancedSimplificationTips()
    ? getSimplificationHint({ numerator: activity === 'multiply' ? left.numerator * right.numerator : left.numerator * right.denominator, denominator: activity === 'multiply' ? left.denominator * right.denominator : left.denominator * right.numerator })
    : 'Si puedes, busca un numero que sirva para simplificar arriba y abajo.';
  const trick = activity === 'multiply'
    ? 'Multiplica arriba con arriba y abajo con abajo.'
    : 'Da la vuelta a la segunda fraccion y luego multiplica.';
  const explanation = activity === 'multiply'
    ? `${left.numerator} × ${right.numerator} = ${left.numerator * right.numerator} y ${left.denominator} × ${right.denominator} = ${left.denominator * right.denominator}. Luego simplificamos a ${result.numerator}/${result.denominator}. ${simplificationTip}`
    : `Primero damos la vuelta a ${right.numerator}/${right.denominator} y queda ${right.denominator}/${right.numerator}. Luego multiplicamos y simplificamos hasta ${result.numerator}/${result.denominator}. ${simplificationTip}`;

  return {
    activity,
    prompt: 'Elige la respuesta correcta',
    left,
    right,
    operator: activity === 'multiply' ? '×' : '÷',
    options,
    correctOptionKey: correctOption.key,
    hint: trick,
    explanation,
    difficulty: state.progressionStep,
    operationSummary: `${operationWord} ${fractionToText(left)} ${activity === 'multiply' ? '×' : '÷'} ${fractionToText(right)}`,
  };
}

function createProperImproperIdentifyChallenge() {
  const { maxDenominator } = getDifficultyConfig();
  const denominator = randomInt(3, maxDenominator);
  const isProper = randomInt(0, 1) === 0;
  const numerator = isProper
    ? randomInt(1, denominator - 1)
    : randomInt(denominator, denominator + Math.max(2, Math.floor(maxDenominator / 2)));
  const fraction = { numerator, denominator };
  const correctKey = isProper ? 'proper' : 'improper';

  return {
    activity: 'proper-improper',
    prompt: 'Que tipo de fraccion es?',
    focus: fraction,
    options: shuffle([
      buildChoiceOption('proper', buildTextOptionMarkup('Propia', 'Numerador menor'), 'Propia'),
      buildChoiceOption('improper', buildTextOptionMarkup('Impropia', 'Numerador mayor o igual'), 'Impropia'),
    ]),
    correctOptionKey: correctKey,
    hint: 'Compara el numerador con el denominador.',
    explanation: isProper
      ? `${numerator} es menor que ${denominator}, por eso ${fractionToText(fraction)} es una fraccion propia.`
      : `${numerator} es mayor o igual que ${denominator}, por eso ${fractionToText(fraction)} es una fraccion impropia.`,
    difficulty: state.progressionStep,
    technique: state.mode,
  };
}

function createImproperToMixedChallenge() {
  const { maxDenominator } = getDifficultyConfig();
  const denominator = randomInt(2, maxDenominator);
  const whole = randomInt(1, state.progressionStep === 'guided' ? 2 : 4);
  const remainder = randomInt(1, denominator - 1);
  const fraction = {
    numerator: whole * denominator + remainder,
    denominator,
  };
  const mixed = { whole, numerator: remainder, denominator };
  const optionData = buildImproperConversionOptions(mixed, fraction);

  return {
    activity: 'proper-improper',
    prompt: 'Convierte la fraccion impropia a numero mixto',
    focus: fraction,
    options: optionData.options,
    correctOptionKey: optionData.correctKey,
    hint: 'Divide el numerador entre el denominador: los enteros salen del cociente y el resto queda arriba.',
    explanation: `${fraction.numerator} ÷ ${denominator} = ${whole} y sobra ${remainder}. Entonces ${fractionToText(fraction)} = ${whole} ${remainder}/${denominator}.`,
    difficulty: state.progressionStep,
    technique: state.mode,
  };
}

function createMixedToImproperChallenge() {
  const { maxDenominator } = getDifficultyConfig();
  const denominator = randomInt(2, maxDenominator);
  const whole = randomInt(1, state.progressionStep === 'guided' ? 2 : 4);
  const numerator = randomInt(1, denominator - 1);
  const mixed = { whole, numerator, denominator };
  const fraction = {
    numerator: whole * denominator + numerator,
    denominator,
  };
  const optionData = buildMixedConversionOptions(mixed, fraction);

  return {
    activity: 'proper-improper',
    prompt: 'Convierte el numero mixto a fraccion impropia',
    focusMixed: mixed,
    options: optionData.options,
    correctOptionKey: optionData.correctKey,
    hint: 'Multiplica enteros por denominador y suma el numerador.',
    explanation: `${whole} × ${denominator} = ${whole * denominator}; despues sumamos ${numerator} y queda ${fraction.numerator}. Entonces ${whole} ${numerator}/${denominator} = ${fractionToText(fraction)}.`,
    difficulty: state.progressionStep,
    technique: state.mode,
  };
}

function createProperImproperChallenge() {
  if (state.mode === 'proper-improper-identify') {
    return createProperImproperIdentifyChallenge();
  }

  if (state.mode === 'improper-to-mixed') {
    return createImproperToMixedChallenge();
  }

  if (state.mode === 'mixed-to-improper') {
    return createMixedToImproperChallenge();
  }

  const creators = [
    createProperImproperIdentifyChallenge,
    createImproperToMixedChallenge,
    createMixedToImproperChallenge,
  ];
  return creators[randomInt(0, creators.length - 1)]();
}

function createCompareChallenge() {
  if (state.mode === 'same-denominator') {
    return createSameDenominatorChallenge();
  }

  if (state.mode === 'same-numerator') {
    return createSameNumeratorChallenge();
  }

  if (state.mode === 'cross') {
    return createCrossChallenge();
  }

  const creators = [createSameDenominatorChallenge, createSameNumeratorChallenge, createCrossChallenge];
  return creators[randomInt(0, creators.length - 1)]();
}

function createChallenge() {
  if (state.activity === 'compare') {
    return createCompareChallenge();
  }

  if (state.activity === 'add' || state.activity === 'subtract') {
    return createAddSubtractChallenge(state.activity);
  }

  if (state.activity === 'proper-improper') {
    return createProperImproperChallenge();
  }

  return createOperationChallenge(state.activity);
}

function updateActivityUi() {
  const content = activityContent[state.activity];
  controlsKicker.textContent = content.kicker;
  controlsTitle.textContent = content.title;
  controlsDescription.textContent = content.description;
  activityLabel.textContent =
    {
      compare: 'Comparar',
      multiply: 'Multiplicar',
      divide: 'Dividir',
      add: 'Sumar',
      subtract: 'Restar',
      'proper-improper': 'Propias e impropias',
    }[state.activity] || 'Fracciones';
  modeLabel.textContent = getModeLabel();
  levelLabel.textContent = levelLabelMap[state.progressionStep];
  techniqueChip.textContent = `Tecnica: ${getTechniqueLabel()}`;

  renderModeButtons(content.modes);
  renderGuide(content.guide);

  activityButtons.forEach((button) => {
    const active = button.dataset.activity === state.activity;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function renderModeButtons(modes) {
  modeControls.hidden = false;
  modeControls.innerHTML = modes
    .map(
      (mode) => `
        <button class="mode-button ${state.mode === mode.key ? 'active' : ''}" data-mode="${mode.key}">${mode.label}</button>
      `
    )
    .join('');

  Array.from(modeControls.querySelectorAll('.mode-button')).forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      renderChallenge();
      saveProgress();
    });
  });
}

function renderGuide(guide) {
  guideTitle.textContent = guide.title;
  const sections = guide.sections || [{ cards: guide.cards }];

  guideGrid.innerHTML = sections
    .map((section) => {
      const sectionTitle = section.title ? `<h3 class="guide-section-title">${section.title}</h3>` : '';
      const cards = section.cards
        .map(
          (card) => `
            <article>
              <h3>${card.title}</h3>
              <p>${card.text}</p>
            </article>
          `
        )
        .join('');

      return `${sectionTitle}${cards}`;
    })
    .join('');
}

// --- Progresion de largo recorrido: XP, rangos y trofeos por grados ---
// Curva geometrica validada por simulacion: con base lineal el nivel se agota
// en ~100 rondas, igual que un sistema de medallas binarias.
const XP_BASE_NEED = 40;
const XP_GROWTH = 1.08;
const XP_PER_CORRECT = 10;
const XP_STREAK_BONUS_MAX = 10;

const RANKS = [
  { level: 1, name: 'Aprendiz' },
  { level: 3, name: 'Explorador' },
  { level: 6, name: 'Cocinero' },
  { level: 10, name: 'Chef' },
  { level: 15, name: 'Experto' },
  { level: 22, name: 'Maestro' },
  { level: 30, name: 'Campeon' },
  { level: 40, name: 'Leyenda' },
];

const GRADES = ['Bronce', 'Plata', 'Oro', 'Diamante'];

const TROPHIES = [
  { id: 'act-compare', label: 'Comparador', icon: '⚖️', thresholds: [5, 15, 40, 100], value: (s) => s.byActivity.compare.correct },
  { id: 'act-multiply', label: 'Multiplicador', icon: '✖️', thresholds: [5, 15, 40, 100], value: (s) => s.byActivity.multiply.correct },
  { id: 'act-divide', label: 'Divisor', icon: '➗', thresholds: [5, 15, 40, 100], value: (s) => s.byActivity.divide.correct },
  { id: 'act-add', label: 'Sumador', icon: '➕', thresholds: [5, 15, 40, 100], value: (s) => s.byActivity.add.correct },
  { id: 'act-subtract', label: 'Restador', icon: '➖', thresholds: [5, 15, 40, 100], value: (s) => s.byActivity.subtract.correct },
  {
    id: 'act-proper-improper',
    label: 'Maestro de mixtas',
    icon: '🍕',
    thresholds: [5, 15, 40, 100],
    value: (s) => s.byActivity['proper-improper'].correct,
  },
  { id: 'total-correct', label: 'Aciertos', icon: '🎯', thresholds: [10, 50, 150, 400], value: (s) => s.correct },
  { id: 'best-streak', label: 'Mejor racha', icon: '🔥', thresholds: [3, 7, 15, 30], value: (s) => s.bestStreak },
  { id: 'days-played', label: 'Dias jugados', icon: '📅', thresholds: [2, 7, 21, 60], value: (s) => s.daysPlayed },
  {
    id: 'variety',
    label: 'Todoterreno',
    icon: '🌟',
    thresholds: [2, 3, 5, 6],
    value: (s) => ACTIVITY_KEYS.filter((key) => s.byActivity[key].correct >= 5).length,
  },
];

// Nivel alcanzado con una cantidad total de XP, mas el progreso dentro del nivel.
function levelInfo(totalXp) {
  let level = 1;
  let need = XP_BASE_NEED;
  let remaining = Math.max(0, totalXp);

  while (remaining >= need && level < 999) {
    remaining -= need;
    level += 1;
    need = Math.round((need * XP_GROWTH) / 5) * 5;
  }

  let rank = RANKS[0];
  RANKS.forEach((entry) => {
    if (level >= entry.level) {
      rank = entry;
    }
  });

  return { level, rank: rank.name, intoLevel: remaining, need };
}

// Grado alcanzado en un trofeo: 0 = sin empezar, 4 = diamante.
function trophyInfo(trophy) {
  const value = trophy.value(state);
  let grade = 0;
  trophy.thresholds.forEach((threshold, index) => {
    if (value >= threshold) {
      grade = index + 1;
    }
  });

  const next = trophy.thresholds[grade];
  const previous = grade === 0 ? 0 : trophy.thresholds[grade - 1];
  const percent = next ? Math.min(100, Math.round(((value - previous) / (next - previous)) * 100)) : 100;

  return { value, grade, next, percent };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// Racha de dias consecutivos: compara contra la fecha de ayer.
function registerPlayDay() {
  const today = todayKey();
  if (state.lastPlayDay === today) {
    return;
  }
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  state.dayStreak = state.lastPlayDay === yesterday ? state.dayStreak + 1 : 1;
  if (state.dayStreak > state.bestDayStreak) {
    state.bestDayStreak = state.dayStreak;
  }
  state.lastPlayDay = today;
  state.daysPlayed += 1;
}

function awardXp(isCorrect) {
  if (!isCorrect) {
    return;
  }
  const bonus = Math.min(XP_STREAK_BONUS_MAX, Math.max(0, state.streak - 1) * 2);
  state.xp += XP_PER_CORRECT + bonus;
}

function renderRank() {
  const info = levelInfo(state.xp);
  rankName.textContent = info.rank;
  rankLevel.textContent = `Nivel ${info.level}`;
  const percent = Math.min(100, Math.round((info.intoLevel / info.need) * 100));
  rankFill.style.width = `${percent}%`;
  rankBar.setAttribute('aria-valuenow', String(percent));
  rankHint.textContent = `${info.need - info.intoLevel} puntos para el nivel ${info.level + 1}`;
}

// Markup de una medalla: cinta + disco metalico + estrellas de grado.
// Se usa tanto en la app como en preview-medallas.html.
function buildTrophyMarkup(trophy, info) {
  const stars = `${'★'.repeat(info.grade)}<b>${'★'.repeat(4 - info.grade)}</b>`;
  const face = info.grade === 0 ? '🔒' : trophy.icon;
  const goal = info.next ? `${info.value} / ${info.next}` : `${info.value} ¡maximo!`;

  return `
    <article class="trophy t${info.grade}" title="${trophy.label}: ${goal}">
      <div class="ribbon"><i></i><i></i></div>
      <div class="disc">${face}</div>
      <div class="stars">${stars}</div>
      <div class="tn">${trophy.label}</div>
      <div class="mbar"><i style="width:${info.percent}%"></i></div>
      <div class="tsub">${goal}</div>
    </article>
  `;
}

// --- Misiones diarias ---
// Deterministas por fecha: mismas misiones todo el dia, distintas al siguiente,
// sin necesidad de backend ni de guardar el estado del generador.
const MISSION_POOL = [
  { t: 'ok', goal: 10, xp: 40, txt: (g) => `Consigue ${g} aciertos` },
  { t: 'ok', goal: 18, xp: 70, txt: (g) => `Consigue ${g} aciertos` },
  { t: 'answers', goal: 15, xp: 40, txt: (g) => `Responde ${g} preguntas` },
  { t: 'streak', goal: 5, xp: 60, txt: (g) => `Encadena una racha de ${g}`, max: true },
  { t: 'streak', goal: 8, xp: 90, txt: (g) => `Encadena una racha de ${g}`, max: true },
  { t: 'act_compare', goal: 5, xp: 45, txt: (g) => `Acierta ${g} de comparar` },
  { t: 'act_multiply', goal: 5, xp: 45, txt: (g) => `Acierta ${g} de multiplicar` },
  { t: 'act_divide', goal: 5, xp: 45, txt: (g) => `Acierta ${g} de dividir` },
  { t: 'act_add', goal: 5, xp: 45, txt: (g) => `Acierta ${g} de sumar` },
  { t: 'act_subtract', goal: 5, xp: 45, txt: (g) => `Acierta ${g} de restar` },
  { t: 'act_proper-improper', goal: 5, xp: 45, txt: (g) => `Acierta ${g} de propias e impropias` },
];

const MISSIONS_PER_DAY = 3;

// Hash polinomico base 31 sobre la fecha: mismo dia -> mismas misiones.
function seedFromDate(text) {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

function refreshMissions() {
  const today = todayKey();
  if (state.missions && state.missions.day === today) {
    return;
  }

  const hash = seedFromDate(today);
  const picked = [];
  // Paso 7 (coprimo con el tamano del pool) para barrer sin ciclar pronto.
  for (let k = 0; picked.length < MISSIONS_PER_DAY && k < 60; k += 1) {
    const candidate = MISSION_POOL[(hash + k * 7) % MISSION_POOL.length];
    if (!picked.some((entry) => entry.t === candidate.t)) {
      picked.push(candidate);
    }
  }

  state.missions = {
    day: today,
    list: picked.map((mission) => ({
      t: mission.t,
      goal: mission.goal,
      xp: mission.xp,
      txt: mission.txt(mission.goal),
      max: Boolean(mission.max),
      progress: 0,
      done: false,
    })),
  };
}

// Unico punto de entrada al progreso de misiones.
function bumpMission(type, amount) {
  if (!state.missions) {
    return;
  }

  let completed = false;
  state.missions.list.forEach((mission) => {
    if (mission.done || mission.t !== type) {
      return;
    }
    // `max` para metricas que no se acumulan (la racha es un maximo, no una suma).
    mission.progress = mission.max ? Math.max(mission.progress, amount) : mission.progress + amount;
    if (mission.progress >= mission.goal) {
      mission.done = true;
      state.xp += mission.xp;
      showToast(`🎯 Mision cumplida: +${mission.xp} puntos`);
      completed = true;
    }
  });

  if (completed) {
    pulse(questBtn);
  }
}

function renderMissions() {
  misDay.textContent = state.dayStreak > 1 ? `🔥 ${state.dayStreak} dias seguidos jugando` : '';

  const list = state.missions ? state.missions.list : [];
  misList.innerHTML = list
    .map((mission) => {
      const percent = Math.min(100, Math.round((mission.progress / mission.goal) * 100));
      return `
        <div class="mis ${mission.done ? 'done' : ''}">
          <div class="mtop"><span>${mission.done ? '✅' : '⬜'} ${mission.txt}</span><b>+${mission.xp}</b></div>
          <div class="mbar"><i style="width:${percent}%"></i></div>
          <div class="msub">${Math.min(mission.progress, mission.goal)} / ${mission.goal}</div>
        </div>
      `;
    })
    .join('');

  // El badge cuenta lo que FALTA, que motiva mas que lo conseguido.
  const left = list.filter((mission) => !mission.done).length;
  questBadge.textContent = left || '✓';
  questBadge.classList.toggle('zero', !left);
}

// --- Vault de medallas ---
function totalGrades() {
  return TROPHIES.reduce((sum, trophy) => sum + trophyInfo(trophy).grade, 0);
}

// Detecta grados nuevos para avisar y hacer pulsar el boton del vault.
function checkNewGrades() {
  let won = false;
  TROPHIES.forEach((trophy) => {
    const now = trophyInfo(trophy).grade;
    const previous = state.grades[trophy.id] || 0;
    if (now > previous) {
      state.grades[trophy.id] = now;
      won = true;
      for (let k = previous; k < now; k += 1) {
        showToast(`${['🥉', '🥈', '🥇', '💎'][k]} ¡${trophy.label} ${GRADES[k]}!`);
      }
    }
  });
  if (won) {
    pulse(vaultBtn);
  }
}

function renderVault() {
  const got = totalGrades();
  const all = TROPHIES.length * 4;
  vGot.textContent = got;
  vAll.textContent = all;
  vBar.style.width = `${Math.round((got / all) * 100)}%`;

  const perMetal = [0, 0, 0, 0];
  TROPHIES.forEach((trophy) => {
    const { grade } = trophyInfo(trophy);
    for (let i = 0; i < grade; i += 1) {
      perMetal[i] += 1;
    }
  });
  vMetals.innerHTML = ['🥉', '🥈', '🥇', '💎']
    .map((icon, i) => `<div><b>${icon}</b>${perMetal[i]}</div>`)
    .join('');

  const unseen = Math.max(0, got - (state.seenGrades || 0));
  vaultBadge.textContent = unseen;
  vaultBadge.classList.toggle('hide', !unseen);

  // Nunca se filtra la lista: las bloqueadas siguen mostrando cuanto falta.
  medalGrid.innerHTML = TROPHIES.map((trophy) => buildTrophyMarkup(trophy, trophyInfo(trophy))).join('');
}

// --- Sonido sintetizado ---
// Osciladores generados al vuelo: cero ficheros de audio, nada que cachear en el PWA.
let audioCtx = null;

function blip(freq, duration = 0.12, type = 'triangle', volume = 0.16) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration + 0.02);
  } catch (error) {
    // Sin audio disponible: la animacion sigue funcionando igual.
  }
}

function chord(freqs, duration = 0.6) {
  freqs.forEach((freq, i) => setTimeout(() => blip(freq, duration, 'triangle', 0.13), i * 55));
}

// --- Revelado en cascada: pum pum pum ... PUMMM ---
// Las conseguidas salen ordenadas por grado ascendente para que el crescendo
// termine siempre en la mejor medalla que tenga.
let showTimers = [];
let showDone = false;

function clearShowTimers() {
  showTimers.forEach(clearTimeout);
  showTimers = [];
}

function revealMedals(grid, options = {}) {
  const cards = Array.from(grid.children);
  grid.classList.add('reveal');
  cards.forEach((card) => {
    card.classList.remove('show', 'finale');
    card.style.animation = '';
    card.style.opacity = '';
  });
  void grid.offsetWidth; // fuerza reflow para poder repetir la animacion

  const earned = cards.filter((card) => !card.classList.contains('t0'))
    .sort((a, b) => gradeOfCard(a) - gradeOfCard(b));
  const locked = cards.filter((card) => card.classList.contains('t0'));
  const step = options.quick ? 55 : 170;
  const withSound = !options.quick;

  earned.forEach((card, i) => {
    const last = i === earned.length - 1;
    const delay = last ? i * step + (options.quick ? 0 : 380) : i * step;
    const timer = setTimeout(() => {
      card.classList.add(last ? 'finale' : 'show');
      if (!withSound) {
        return;
      }
      if (last) {
        chord([523, 659, 784, 1047]);
        if (navigator.vibrate) {
          navigator.vibrate([40, 60, 120]);
        }
      } else {
        blip(330 + i * 45, 0.11);
      }
    }, delay);
    if (!options.quick) {
      showTimers.push(timer);
    }
  });

  const after = earned.length ? earned.length * step + (options.quick ? 60 : 900) : 0;
  locked.forEach((card, i) => {
    const timer = setTimeout(() => card.classList.add('show'), after + i * (options.quick ? 25 : 45));
    if (!options.quick) {
      showTimers.push(timer);
    }
  });

  const end = setTimeout(() => options.onEnd && options.onEnd(), after + locked.length * 45 + 400);
  if (!options.quick) {
    showTimers.push(end);
  }
}

// Lee el grado desde la clase tN del articulo.
function gradeOfCard(card) {
  const match = /\bt(\d)\b/.exec(card.className);
  return match ? Number(match[1]) : 0;
}

// --- Showcase a pantalla completa ---
function openShow() {
  state.seenGrades = totalGrades();
  saveProgress();
  renderVault();

  chest.classList.add('open');
  showGrid.innerHTML = medalGrid.innerHTML;
  showFoot.classList.remove('on');
  skipHint.classList.remove('hide');
  showTitle.textContent = 'Abriendo el cofre...';
  bigChest.classList.remove('open');
  bigChest.classList.add('shake');
  show.classList.add('on');
  showDone = false;

  blip(220, 0.12);
  setTimeout(() => blip(300, 0.1), 120);
  showTimers.push(setTimeout(() => {
    bigChest.classList.remove('shake');
    bigChest.classList.add('open');
    blip(520, 0.18);
    showTitle.textContent = '🏆 ¡Tus medallas!';
    revealMedals(showGrid, { onEnd: endShow });
  }, 650));
}

function endShow() {
  showDone = true;
  showTitle.textContent = `🏆 ${totalGrades()} de ${TROPHIES.length * 4} conseguidas`;
  showFoot.classList.add('on');
  skipHint.classList.add('hide');
}

function closeShow(openPanel) {
  clearShowTimers();
  show.classList.remove('on');
  chest.classList.remove('open');
  if (openPanel) {
    setTimeout(() => {
      toggleDrawer('vault', true);
      revealMedals(medalGrid, { quick: true });
    }, 180);
  }
}

function skipShow() {
  clearShowTimers();
  bigChest.classList.remove('shake');
  bigChest.classList.add('open');
  Array.from(showGrid.children).forEach((card) => {
    card.style.animation = 'none';
    card.style.opacity = card.classList.contains('t0') ? '0.45' : '1';
  });
  endShow();
}

// --- Utilidades de UI ---
function pulse(node) {
  node.classList.remove('pulse');
  void node.offsetWidth; // fuerza reflow para poder repetir la animacion
  node.classList.add('pulse');
}

function showToast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  toastHost.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function toggleDrawer(id, force) {
  const drawer = id === 'vault' ? vault : quests;
  const on = force === undefined ? !drawer.classList.contains('on') : Boolean(force);
  drawer.classList.toggle('on', on);
  if (id === 'vault' && on) {
    // Al abrirlo dejan de estar "sin ver".
    state.seenGrades = totalGrades();
    saveProgress();
    renderVault();
  }
}

function renderAchievements() {
  renderRank();
  renderVault();
  renderMissions();
}

function unlockAchievement(id) {
  if (!state.achievements.includes(id)) {
    state.achievements.push(id);
  }
}

function updateAchievementsOnSuccess(challenge) {
  unlockAchievement('first-correct');

  if (state.streak >= 3) {
    unlockAchievement('streak-3');
  }

  if (state.streak >= 5) {
    unlockAchievement('streak-5');
  }

  if ((challenge.activity === 'multiply' || challenge.activity === 'divide') && challenge.explanation.includes('simplific')) {
    unlockAchievement('super-simplifier');
  }

  if ((challenge.activity === 'add' || challenge.activity === 'subtract') && challenge.explanation.includes('denominador comun')) {
    unlockAchievement('denominator-matcher');
  }

  if (challenge.activity === 'proper-improper') {
    unlockAchievement('mixed-master');
  }

  if (state.correct >= 6 || state.achievements.includes('super-simplifier')) {
    unlockAchievement('fraction-explorer');
  }
}

function buildOperationPreview(challenge) {
  if (challenge.activity === 'compare') {
    operationPreview.hidden = true;
    operationPreview.innerHTML = '';
    return;
  }

  if (challenge.activity === 'proper-improper') {
    operationPreview.hidden = false;
    operationPreview.innerHTML = `
      <div class="operation-card fraction-focus-card">
        ${challenge.focus
          ? buildFractionMarkup(challenge.focus.numerator, challenge.focus.denominator)
          : buildMixedNumberMarkup(challenge.focusMixed.whole, challenge.focusMixed.numerator, challenge.focusMixed.denominator)}
      </div>
    `;
    return;
  }

  operationPreview.hidden = false;
  operationPreview.innerHTML = `
    <div class="operation-card">
      ${buildCompactFractionMarkup(challenge.left.numerator, challenge.left.denominator)}
      <span class="operation-symbol">${challenge.operator}</span>
      ${buildCompactFractionMarkup(challenge.right.numerator, challenge.right.denominator)}
      <span class="operation-symbol">=</span>
      <span class="operation-question">?</span>
    </div>
  `;
}

function renderChallenge() {
  setProgressionStep();
  state.currentChallenge = createChallenge();
  state.answered = false;
  const answerLayout = state.currentChallenge.options.length === 2 ? 'compare-layout' : 'operation-layout';
  answerOptions.className = `answer-options ${answerLayout}`;
  answerOptions.innerHTML = state.currentChallenge.options
    .map(
      (option) => `
        <button class="answer-button" data-option-key="${option.key}" type="button">
          ${option.label}
        </button>
      `
    )
    .join('');

  feedbackBox.className = 'feedback';
  feedbackBox.textContent = 'Elige una opcion o pulsa "Ver pista".';
  updateActivityUi();
  buildOperationPreview(state.currentChallenge);
  updateActionLabels();
}

function showHint() {
  const challenge = state.currentChallenge;
  feedbackBox.className = 'feedback';
  feedbackBox.textContent = `${challenge.hint} ${challenge.explanation}`;
}

function highlightAnswers(selectedKey, correctKey) {
  Array.from(answerOptions.querySelectorAll('.answer-button')).forEach((button) => {
    const isCorrect = button.dataset.optionKey === correctKey;
    const isWrongSelection = button.dataset.optionKey === selectedKey && selectedKey !== correctKey;

    button.classList.remove('correct', 'wrong');

    if (isCorrect) {
      button.classList.add('correct');
    }

    if (isWrongSelection) {
      button.classList.add('wrong');
    }

    button.disabled = true;
  });
}

function answer(selectedKey) {
  if (state.answered) {
    return;
  }

  const challenge = state.currentChallenge;
  const correctKey = challenge.correctOptionKey;
  const isCorrect = selectedKey === correctKey;
  const correctOption = challenge.options.find((option) => option.key === correctKey);

  state.answered = true;
  registerPlayDay();

  const activityStats = state.byActivity[challenge.activity];
  if (activityStats) {
    activityStats.attempts += 1;
  }

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) {
      state.bestStreak = state.streak;
    }
    if (activityStats) {
      activityStats.correct += 1;
      if (state.streak > activityStats.bestStreak) {
        activityStats.bestStreak = state.streak;
      }
    }
    feedbackBox.className = 'feedback success';
    feedbackBox.textContent = `Muy bien. ${challenge.hint} ${challenge.explanation}`;
    updateAchievementsOnSuccess(challenge);
    awardXp(true);
    bumpMission('ok', 1);
    bumpMission(`act_${challenge.activity}`, 1);
    bumpMission('streak', state.streak);
  } else {
    state.streak = 0;
    feedbackBox.className = 'feedback error';
    feedbackBox.textContent = `Casi. La correcta era ${correctOption.plainLabel}. ${challenge.hint} ${challenge.explanation}`;
  }

  highlightAnswers(selectedKey, correctKey);
  bumpMission('answers', 1);
  checkNewGrades();
  correctCount.textContent = state.correct;
  streakCount.textContent = state.streak;
  renderAchievements();
  updateActionLabels();
  saveProgress();
}

answerOptions.addEventListener('click', (event) => {
  const button = event.target.closest('.answer-button');

  if (!button) {
    return;
  }

  answer(button.dataset.optionKey);
});

hintButton.addEventListener('click', showHint);
nextButton.addEventListener('click', renderChallenge);

activityButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.activity = button.dataset.activity;
    state.mode = activityContent[state.activity].defaultMode;
    renderChallenge();
    saveProgress();
  });
});

loadProgress();
refreshMissions();
// Cierre de los cajones por boton, clic en el fondo y tecla Escape.
// El cofre no abre el cajon directamente: lanza el showcase a pantalla completa.
vaultBtn.addEventListener('click', () => {
  if (vault.classList.contains('on')) {
    toggleDrawer('vault', false);
    return;
  }
  openShow();
});
showToVault.addEventListener('click', () => closeShow(true));
showClose.addEventListener('click', () => closeShow(false));
show.addEventListener('click', (event) => {
  if (event.target.closest('.showfoot')) {
    return;
  }
  if (showDone) {
    closeShow(false);
    return;
  }
  skipShow(); // tocar en cualquier sitio salta la animacion
});
questBtn.addEventListener('click', () => toggleDrawer('quests'));
document.addEventListener('click', (event) => {
  const closer = event.target.closest('[data-close]');
  if (closer) {
    toggleDrawer(closer.dataset.close, false);
    return;
  }
  if (event.target === vault) toggleDrawer('vault', false);
  if (event.target === quests) toggleDrawer('quests', false);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  toggleDrawer('vault', false);
  toggleDrawer('quests', false);
  closeShow(false);
});
// El modo guardado debe existir en la actividad guardada; si no, se usa el de por defecto.
const restoredContent = activityContent[state.activity];
if (!restoredContent || !restoredContent.modes.some((mode) => mode.key === state.mode)) {
  state.mode = restoredContent ? restoredContent.defaultMode : 'mixed';
}
correctCount.textContent = state.correct;
streakCount.textContent = state.streak;
renderAchievements();
renderChallenge();
