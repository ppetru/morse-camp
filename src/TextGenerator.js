import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

const REPEAT_DELAY_MS = 30 * 1000;

const computeWordWeights = (words, state, time) => {
  var candidates = new Map();
  var successful_words = new Map();
  for (let [word, data] of state.entries()) {
    if (time - data.t > REPEAT_DELAY_MS) {
      if (data.s < 1) {
        candidates.set(word, 1 - data.s);
      } else {
        successful_words.set(word, time - data.t);
      }
    }
  }
  if (candidates.size === 0) {
    for (let [word, freq] of words) {
      if (!state.has(word)) {
        candidates.set(word, freq);
      }
    }
  }
  if (candidates.size === 0) {
    candidates = successful_words;
  }

  return candidates;
};

function generateText(dictionary, minLength, maxLength) {
  var words = [];
  var weights = [];
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
}

export { computeWordWeights, generateText, REPEAT_DELAY_MS };
