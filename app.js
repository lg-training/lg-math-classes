const state = {
  activity: 'compare',
  mode: 'mixed',
  currentChallenge: null,
  correct: 0,
  streak: 0,
  answered: false,
  progressionStep: 'guided',
  achievements: [],
};

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
      cards: [
        {
          title: 'Fraccion propia',
          text: 'Es menor que 1 entero: el numerador es menor que el denominador.',
        },
        {
          title: 'Fraccion impropia',
          text: 'Llega a 1 entero o lo supera: el numerador es mayor o igual que el denominador.',
        },
        {
          title: 'Numero mixto',
          text: 'Separa los enteros completos y deja el resto como fraccion.',
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
const achievementList = document.getElementById('achievementList');
const activityLabel = document.getElementById('activityLabel');
const levelLabel = document.getElementById('levelLabel');
const techniqueChip = document.getElementById('techniqueChip');
const guideTitle = document.getElementById('guideTitle');
const guideCardTitle1 = document.getElementById('guideCardTitle1');
const guideCardTitle2 = document.getElementById('guideCardTitle2');
const guideCardTitle3 = document.getElementById('guideCardTitle3');
const guideCardText1 = document.getElementById('guideCardText1');
const guideCardText2 = document.getElementById('guideCardText2');
const guideCardText3 = document.getElementById('guideCardText3');

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
  const numerator = randomInt(1, Math.min(6, maxNumerator));
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

  while (distractors.length < 2) {
    const candidate = {
      numerator: Math.max(1, correctFraction.numerator + randomInt(1, 3)),
      denominator: Math.max(2, correctFraction.denominator + randomInt(0, 3)),
    };
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

  distractors.forEach((mixed) => {
    if (mixed.numerator <= 0 || mixed.numerator >= mixed.denominator) {
      return;
    }

    const key = `mixed-${mixed.whole}-${mixed.numerator}-${mixed.denominator}`;
    if (!options.some((option) => option.key === key) && options.length < 3) {
      options.push(buildChoiceOption(key, buildMixedNumberMarkup(mixed.whole, mixed.numerator, mixed.denominator), `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`));
    }
  });

  while (options.length < 3) {
    const whole = Math.max(1, correctMixed.whole + randomInt(-1, 1));
    const numerator = randomInt(1, correctMixed.denominator - 1);
    const key = `mixed-${whole}-${numerator}-${correctMixed.denominator}`;
    if (!options.some((option) => option.key === key)) {
      options.push(buildChoiceOption(key, buildMixedNumberMarkup(whole, numerator, correctMixed.denominator), `${whole} ${numerator}/${correctMixed.denominator}`));
    }
  }

  return {
    options: shuffle(options),
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

  distractors.forEach((fraction) => {
    const text = fractionToText(fraction);
    const key = `fraction-${text}`;
    if (text !== correctText && !options.some((option) => option.key === key) && options.length < 3) {
      options.push(buildChoiceOption(key, buildCompactFractionMarkup(fraction.numerator, fraction.denominator), text));
    }
  });

  while (options.length < 3) {
    const numerator = correctFraction.numerator + randomInt(1, 3);
    const text = `${numerator}/${correctFraction.denominator}`;
    const key = `fraction-${text}`;
    if (!options.some((option) => option.key === key)) {
      options.push(buildChoiceOption(key, buildCompactFractionMarkup(numerator, correctFraction.denominator), text));
    }
  }

  return {
    options: shuffle(options),
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
      buildChoiceOption('proper', buildTextOptionMarkup('Propia', 'Menor que 1 entero'), 'Propia'),
      buildChoiceOption('improper', buildTextOptionMarkup('Impropia', 'Igual o mayor que 1 entero'), 'Impropia'),
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
    });
  });
}

function renderGuide(guide) {
  guideTitle.textContent = guide.title;
  guideCardTitle1.textContent = guide.cards[0].title;
  guideCardText1.textContent = guide.cards[0].text;
  guideCardTitle2.textContent = guide.cards[1].title;
  guideCardText2.textContent = guide.cards[1].text;
  guideCardTitle3.textContent = guide.cards[2].title;
  guideCardText3.textContent = guide.cards[2].text;
}

function renderAchievements() {
  if (state.achievements.length === 0) {
    achievementList.innerHTML = '<span class="achievement-empty">Juega una ronda para desbloquear tu primera medalla.</span>';
    return;
  }

  achievementList.innerHTML = state.achievements
    .map((achievement) => `<span class="achievement-badge">${achievement}</span>`)
    .join('');
}

function unlockAchievement(name) {
  if (!state.achievements.includes(name)) {
    state.achievements.push(name);
  }
}

function updateAchievementsOnSuccess(challenge) {
  unlockAchievement('Primer acierto');

  if (state.streak >= 3) {
    unlockAchievement('Racha de 3');
  }

  if (state.streak >= 5) {
    unlockAchievement('Racha de 5');
  }

  if ((challenge.activity === 'multiply' || challenge.activity === 'divide') && challenge.explanation.includes('simplific')) {
    unlockAchievement('Super simplificador');
  }

  if ((challenge.activity === 'add' || challenge.activity === 'subtract') && challenge.explanation.includes('denominador comun')) {
    unlockAchievement('Igualador de denominadores');
  }

  if (challenge.activity === 'proper-improper') {
    unlockAchievement('Maestro de mixtas');
  }

  const activitySet = new Set(state.achievements);
  if (state.correct >= 6 || activitySet.has('Super simplificador')) {
    unlockAchievement('Explorador de fracciones');
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

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    feedbackBox.className = 'feedback success';
    feedbackBox.textContent = `Muy bien. ${challenge.hint} ${challenge.explanation}`;
    updateAchievementsOnSuccess(challenge);
  } else {
    state.streak = 0;
    feedbackBox.className = 'feedback error';
    feedbackBox.textContent = `Casi. La correcta era ${correctOption.plainLabel}. ${challenge.hint} ${challenge.explanation}`;
  }

  highlightAnswers(selectedKey, correctKey);
  correctCount.textContent = state.correct;
  streakCount.textContent = state.streak;
  renderAchievements();
  updateActionLabels();
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
  });
});

renderAchievements();
renderChallenge();
