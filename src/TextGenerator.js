import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

const REPEAT_DELAY_MS = 30 * 1000;

function generateText(store, wordsBySize, time) {
  var words = [];
  var weights = [];
  var successful_words = [];
  var successful_weights = [];
  for (let [word, data] of store.words.entries()) {
    if (word.length < store.minLength || word.length > store.maxLength) {
      continue;
    }
    if (time - data.t > REPEAT_DELAY_MS) {
      if (data.s < 1) {
        words.push(word);
        weights.push(1 - data.s);
      } else {
        successful_words.push(word);
        successful_weights.push(time - data.t);
      }
    }
  }
  if (words.length === 0) {
    for (let i = store.minLength; i <= store.maxLength; i++) {
      if (wordsBySize.has(i)) {
        for (let [word, freq] of wordsBySize.get(i)) {
          if (!store.words.has(word)) {
            words.push(word);
            weights.push(freq);
          }
        }
      }
    }
  }
  if (words.length === 0) {
    words = successful_words;
    weights = successful_weights;
  }

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
}

export { generateText, REPEAT_DELAY_MS };
