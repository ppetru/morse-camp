import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

const REPEAT_DELAY_MS = 60 * 1000;
const ELAPSED_WEIGHT = 1 / 1000;
const SCORE_WEIGHT = 2;

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

const generateText = (dictionary, minLength, maxLength) => {
  let words = [];
  let weights = [];

  dictionary.forEach((freq, word) => {
    if (word.length >= minLength && word.length <= maxLength) {
      words.push(word);
      weights.push(freq);
    }
  });

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
};

export { computeWordWeights, generateText, REPEAT_DELAY_MS };
