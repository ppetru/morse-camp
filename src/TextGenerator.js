import "seedrandom";

const weighted = require("weighted");

Math.seedrandom();

const REPEAT_DELAY_MS = 60 * 1000;
const ELAPSED_WEIGHT = 1 / 10000;
const SCORE_WEIGHT = 1;

const trimDictionary = (dictionary, maxWords) => {
  let freqs = [];
  dictionary.forEach((freq, word) => {
    freqs.push(freq);
  });
  freqs = freqs.sort(function(a, b) {
    return b - a;
  }); //highest to lowest

  let minFrequency = freqs[maxWords - 1];

  let result = new Map();
  dictionary.forEach((freq, word) => {
    if (freq >= minFrequency && result.size < maxWords) {
      result.set(word, freq);
    }
  });

  return result;
};

const computeWordWeights = (words, state, timeNow) => {
  let result = new Map(words);

  result.forEach((freq, word) => {
    if (state.has(word)) {
      const { score, time } = state.get(word);
      const elapsed = timeNow - time;
      let weight = freq;

      if (elapsed < REPEAT_DELAY_MS) {
        weight = 0;
      } else {
        weight *= 1 + (elapsed - REPEAT_DELAY_MS) * ELAPSED_WEIGHT;
      }
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
      weights.push(freq * Math.pow(2, word.length)); // avoid short, frequent words dominating everything
    }
  });

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
};

const permissivelyPickWord = (dictionary, minLength, maxLength) => {
  //allow smaller
  var minLengthSmaller = minLength - 1;
  var t;
  while (minLengthSmaller >= 1) {
    t = pickWord(dictionary, minLengthSmaller, maxLength);
    if (t) {
      return t;
    }
    minLengthSmaller--;
  }

  //allow larger
  var maxLengthLarger = maxLength + 1;
  while (true) {
    t = pickWord(dictionary, minLength, maxLengthLarger);
    if (t) {
      return t;
    }
    maxLengthLarger++;
  }
};

const makeText = (dictionary, minLength, maxLength) => {
  let word = pickWord(dictionary, minLength, maxLength - (1 + minLength));
  if (!word) {
    word = permissivelyPickWord(dictionary, minLength, maxLength);
  }
  let words = [word];
  var remainingLength = maxLength - word.length;

  const additionalMinLength = 2;
  while (remainingLength > additionalMinLength) {
    word = pickWord(
      dictionary,
      additionalMinLength,
      remainingLength - 1,
      words
    );
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

export { trimDictionary, computeWordWeights, generateText, REPEAT_DELAY_MS };
