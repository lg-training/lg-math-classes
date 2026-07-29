const state = {
  mode: 'mixed',
  currentChallenge: null,
  correct: 0,
  streak: 0,
  answered: false,
};

const modeLabelMap = {
  mixed: 'Mixto',
  'same-denominator': 'Mismo denominador',
  'same-numerator': 'Mismo numerador',
  cross: 'Multiplica en cruz',
};

const promptText = document.getElementById('promptText');
const leftFractionButton = document.getElementById('leftFraction');
const rightFractionButton = document.getElementById('rightFraction');
const feedbackBox = document.getElementById('feedbackBox');
const correctCount = document.getElementById('correctCount');
const streakCount = document.getElementById('streakCount');
const modeLabel = document.getElementById('modeLabel');
const hintButton = document.getElementById('hintButton');
const nextButton = document.getElementById('nextButton');
const modeButtons = Array.from(document.querySelectorAll('.mode-button'));

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function buildFractionMarkup(numerator, denominator) {
  return `
    <span class="fraction" aria-label="${numerator} partido ${denominator}">
      <span>${numerator}</span>
      <span class="line"></span>
      <span>${denominator}</span>
    </span>
  `;
}

function createSameDenominatorChallenge() {
  const denominator = randomInt(3, 12);
  let leftNumerator = randomInt(1, denominator - 1);
  let rightNumerator = randomInt(1, denominator - 1);

  while (leftNumerator === rightNumerator) {
    rightNumerator = randomInt(1, denominator - 1);
  }

  return {
    left: { numerator: leftNumerator, denominator },
    right: { numerator: rightNumerator, denominator },
    trick: 'Mismo denominador: gana el numerador mayor.',
    explanation: `Como los dos tienen ${denominator} abajo, solo miramos arriba: ${leftNumerator} y ${rightNumerator}.`,
  };
}

function createSameNumeratorChallenge() {
  const numerator = randomInt(1, 9);
  let leftDenominator = randomInt(numerator + 1, 12);
  let rightDenominator = randomInt(numerator + 1, 12);

  while (leftDenominator === rightDenominator) {
    rightDenominator = randomInt(numerator + 1, 12);
  }

  return {
    left: { numerator, denominator: leftDenominator },
    right: { numerator, denominator: rightDenominator },
    trick: 'Mismo numerador: gana el denominador menor.',
    explanation: `Como los dos tienen ${numerator} arriba, gana la fraccion con menos partes abajo.`,
  };
}

function createCrossChallenge() {
  let left = null;
  let right = null;

  while (!left || !right) {
    const candidateLeft = {
      numerator: randomInt(1, 9),
      denominator: randomInt(2, 12),
    };
    const candidateRight = {
      numerator: randomInt(1, 9),
      denominator: randomInt(2, 12),
    };

    const sameNumerator = candidateLeft.numerator === candidateRight.numerator;
    const sameDenominator = candidateLeft.denominator === candidateRight.denominator;
    const equivalent =
      candidateLeft.numerator * candidateRight.denominator ===
      candidateRight.numerator * candidateLeft.denominator;

    if (sameNumerator || sameDenominator || equivalent) {
      continue;
    }

    if (gcd(candidateLeft.numerator, candidateLeft.denominator) !== 1) {
      continue;
    }

    if (gcd(candidateRight.numerator, candidateRight.denominator) !== 1) {
      continue;
    }

    left = candidateLeft;
    right = candidateRight;
  }

  const leftCross = left.numerator * right.denominator;
  const rightCross = right.numerator * left.denominator;

  return {
    left,
    right,
    trick: 'Todo diferente: multiplica en cruz.',
    explanation: `${left.numerator} x ${right.denominator} = ${leftCross} y ${right.numerator} x ${left.denominator} = ${rightCross}. Gana el producto mayor.`,
  };
}

function createChallenge() {
  if (state.mode === 'same-denominator') {
    return createSameDenominatorChallenge();
  }

  if (state.mode === 'same-numerator') {
    return createSameNumeratorChallenge();
  }

  if (state.mode === 'cross') {
    return createCrossChallenge();
  }

  const creators = [
    createSameDenominatorChallenge,
    createSameNumeratorChallenge,
    createCrossChallenge,
  ];

  return creators[randomInt(0, creators.length - 1)]();
}

function getCorrectSide(challenge) {
  const leftValue = challenge.left.numerator / challenge.left.denominator;
  const rightValue = challenge.right.numerator / challenge.right.denominator;
  return leftValue > rightValue ? 'left' : 'right';
}

function resetButtons() {
  [leftFractionButton, rightFractionButton].forEach((button) => {
    button.classList.remove('correct', 'wrong');
  });
}

function renderChallenge() {
  state.currentChallenge = createChallenge();
  state.answered = false;
  resetButtons();

  leftFractionButton.innerHTML = buildFractionMarkup(
    state.currentChallenge.left.numerator,
    state.currentChallenge.left.denominator
  );

  rightFractionButton.innerHTML = buildFractionMarkup(
    state.currentChallenge.right.numerator,
    state.currentChallenge.right.denominator
  );

  feedbackBox.className = 'feedback';
  feedbackBox.textContent = 'Elige una opcion o pulsa "Ver pista".';
  promptText.textContent = 'Toca la fraccion mayor';
  modeLabel.textContent = modeLabelMap[state.mode];
}

function showHint() {
  const challenge = state.currentChallenge;
  feedbackBox.className = 'feedback';
  feedbackBox.textContent = `${challenge.trick} ${challenge.explanation}`;
}

function answer(side) {
  if (state.answered) {
    return;
  }

  const correctSide = getCorrectSide(state.currentChallenge);
  const isCorrect = side === correctSide;
  state.answered = true;

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    feedbackBox.className = 'feedback success';
    feedbackBox.textContent = `Muy bien. ${state.currentChallenge.trick} ${state.currentChallenge.explanation}`;
  } else {
    state.streak = 0;
    feedbackBox.className = 'feedback error';
    feedbackBox.textContent = `Casi. La correcta era ${correctSide === 'left' ? 'la izquierda' : 'la derecha'}. ${state.currentChallenge.trick} ${state.currentChallenge.explanation}`;
  }

  leftFractionButton.classList.add(correctSide === 'left' ? 'correct' : side === 'left' ? 'wrong' : '');
  rightFractionButton.classList.add(correctSide === 'right' ? 'correct' : side === 'right' ? 'wrong' : '');

  correctCount.textContent = state.correct;
  streakCount.textContent = state.streak;
}

leftFractionButton.addEventListener('click', () => answer('left'));
rightFractionButton.addEventListener('click', () => answer('right'));
hintButton.addEventListener('click', showHint);
nextButton.addEventListener('click', renderChallenge);

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    modeButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    state.mode = button.dataset.mode;
    renderChallenge();
  });
});

renderChallenge();
