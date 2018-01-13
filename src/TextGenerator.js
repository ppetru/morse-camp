import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

const REPEAT_DELAY_MS = 60 * 1000;
const ELAPSED_WEIGHT = 1 / 1000;
const SCORE_WEIGHT = 1;

const computeWordWeights = (words, state, timeNow) => {
  let result = new Map(words);

  result.forEach((freq, word) => {
    if (state.has(word)) {
      const { score, time } = state.get(word);
      const elapsed = timeNow - time;
      let weight = freq;

      weight *= Math.max(0, 1 + (elapsed - REPEAT_DELAY_MS) * ELAPSED_WEIGHT);
      weight *= 1 + (1 - score) * SCORE_WEIGHT;

      if (isNaN(weight) || weight < 0) {
        result.set(word, freq);
      } else {
        result.set(word, weight);
      }
    }
  });

  return result;
};

const pickWord = (wordsByLength, minLength, maxLength) => {
  let words = [];
  let weights = [];

  for (let i = minLength; i <= maxLength; i++) {
    if (wordsByLength.has(i)) {
      words = words.concat(Array.from(wordsByLength.get(i).keys()));
      weights = weights.concat(Array.from(wordsByLength.get(i).values()));
    }
  }

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
};

const makeText = (wordsByLength, minLength, maxLength) => {
  if (maxLength < 5 /* 2 2-char words and 1 space */) {
    return null;
  }
  /* pick first word and make sure there's room for at least one more */
  var text = pickWord(
    wordsByLength,
    2,
    maxLength - /* space */ 1 - /* min word length */ 2
  );
  var remainingLength = maxLength - text.length;

  while (remainingLength >= 3) {
    let word = pickWord(wordsByLength, 2, remainingLength);
    text = text + " " + word;
    remainingLength -= word.length + 1;
  }

  if (text.length >= minLength) {
    return text;
  } else {
    return null;
  }
};

const generateText = (dictionary, minLength, maxLength) => {
  const wordsByLength = new Map();

  dictionary.forEach((freq, word) => {
    if (!wordsByLength.has(word.length)) {
      wordsByLength.set(word.length, new Map());
    }
    wordsByLength.get(word.length).set(word, freq);
  });

  var candidates = [];
  var t;
  t = pickWord(wordsByLength, minLength, maxLength);
  if (t) {
    candidates.push(t);
  }
  t = makeText(wordsByLength, minLength, maxLength);
  if (t) {
    candidates.push(t);
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
};

export { computeWordWeights, generateText, REPEAT_DELAY_MS };
