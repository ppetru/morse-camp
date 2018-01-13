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

const makeText = (dictionary, inputPattern, minLength, maxLength) => {
  if (
    inputPattern.length < 2 ||
    maxLength < inputPattern.length - 1 + minWordLength * inputPattern.length ||
    minLength > inputPattern.length - 1 + maxWordLength * inputPattern.length
  ) {
    return null;
  }

  var pattern = Array.from(inputPattern);
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
    if (!word) {
      return null;
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

// Verb, Noun, adJective, adveRb, Article, Conjunction, Demonstrative,
// preposItion, nuMber, Pronoun, interjection (U)
const PATTERNS = [
  ["j", "n"], // good food
  ["v", "n"], // eat food
  ["a", "n"], // the food
  ["d", "n"], // this food
  ["i", "n"], // from food
  ["c", "j"], // and good
  ["v", "j"], // eat good
  ["v", "i"], // eat from
  ["p", "v"], // you eat
  ["u", "p"], // hey you
  ["r", "j"], // very good
  ["a", "j", "n"], // the good food
  ["r", "j", "n"], // very good food
  ["c", "v", "n"], // and eat food
  ["p", "v", "n"], // you eat food
  ["j", "n", "i", "j", "n"], // good food from better drink
  ["p", "v", "j", "n", "c", "v", "j", "n"] // you eat good food and drink sweet juice
];

const generateText = (dictionary, minLength, maxLength) => {
  var candidates = [];

  var t;
  t = pickWord(dictionary, minLength, maxLength);
  if (t) {
    candidates.push(t);
  }

  for (let pattern of PATTERNS) {
    t = makeText(dictionary, pattern, minLength, maxLength);
    if (t) {
      candidates.push(t);
    }
  }

  console.log(candidates);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

export { computeWordWeights, generateText, REPEAT_DELAY_MS };
