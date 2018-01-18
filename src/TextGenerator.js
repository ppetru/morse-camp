import "seedrandom";
import { minWordLength } from "./Words";

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

const pickWord = (dictionary, minLength, maxLength, blacklist = []) => {
  let words = [];
  let weights = [];

  dictionary.forEach((freq, word) => {
    if (
      word.length >= minLength &&
      word.length <= maxLength &&
      !blacklist.includes(word)
    ) {
      words.push(word);
      weights.push(freq * word.length); // avoid short, frequent words dominating everything
    }
  });

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
};

const makeText = (dictionary, minLength, maxLength) => {
  if (maxLength < 2 * minWordLength + 1) {
    return null;
  }

  let word = pickWord(
    dictionary,
    minWordLength,
    maxLength - (1 + minWordLength)
  );
  if (!word) {
    return null;
  }
  let words = [word];
  var remainingLength = maxLength - word.length;

  while (remainingLength > minWordLength) {
    word = pickWord(dictionary, minWordLength, remainingLength - 1, words);
    if (!word) {
      break;
    }
    words.push(word);
    remainingLength -= word.length + 1;
  }

  const text = words.join(" ");
  if (text.length >= minLength && text.length <= maxLength) {
    return text;
  } else {
    return null;
  }
};

const generateText = (dictionary, minLength, maxLength) => {
  var candidates = [];
  var t;
  t = pickWord(dictionary, minLength, maxLength);
  if (t) {
    candidates.push(t);
  }
  t = makeText(dictionary, minLength, maxLength);
  if (t) {
    candidates.push(t);
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
};

export { computeWordWeights, generateText, REPEAT_DELAY_MS };
