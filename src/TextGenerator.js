import "seedrandom";
import { minWordLength, maxWordLength, partOfSpeech } from "./Words";

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

const pickWord = (dictionary, minLength, maxLength, pos = null) => {
  let words = [];
  let weights = [];

  dictionary.forEach((freq, word) => {
    if (word.length >= minLength && word.length <= maxLength) {
      if (pos && !partOfSpeech.get(pos).has(word)) {
        return;
      }
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

const makeText = (dictionary, pattern, minLength, maxLength) => {
  if (
    pattern.length < 2 ||
    maxLength < pattern.length - 1 + minWordLength * pattern.length ||
    minLength > pattern.length - 1 + maxWordLength * pattern.length
  ) {
    return null;
  }

  var words = [];
  var remainingLength = maxLength;

  while (pattern.length) {
    let pos = pattern.shift();
    let word = pickWord(
      dictionary,
      minWordLength,
      remainingLength -
        (pattern.length ? pattern.length - 1 : 0) -
        pattern.length * minWordLength,
      pos
    );
    console.log(pos, word);
    if (!word) {
      return null;
    }
    words.push(word);
    remainingLength -= word.length + 1;
  }

  const text = words.join(" ");
  console.log(text, text.length);
  if (text.length >= minLength && text.length <= maxLength) {
    return text;
  } else {
    return null;
  }
};

const generateText = (dictionary, minLength, maxLength) => {
  var candidates = [];

  var t;
  /*t = pickWord(dictionary, minLength, maxLength);
  if (t) {
    candidates.push(t);
  }*/

  t = makeText(dictionary, ["j", "n"], minLength, maxLength);
  if (t) {
    candidates.push(t);
  }

  console.log(candidates);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

export { computeWordWeights, generateText, REPEAT_DELAY_MS };
