import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

const REPEAT_DELAY_MS = 30 * 1000;

function generateText(store, wordsBySize, time) {
  var words = [];
  var weights = [];
  for (let [word, data] of store.words.entries()) {
    if (word.length < store.minLength || word.length > store.maxLength) {
      continue;
    }
    if (data.s < 1 && time - data.t > REPEAT_DELAY_MS) {
      words.push(word);
      weights.push(1 - data.s);
    }
  }
  if (words.length === 0) {
    for (let i = store.minLength; i <= store.maxLength; i++) {
      if (wordsBySize.has(i)) {
        for (let [word, freq] of wordsBySize.get(i)) {
          let data = store.words.get(word);
          if (!data || (data.s === 1 && time - data.t > REPEAT_DELAY_MS)) {
            words.push(word);
            weights.push(freq);
          }
        }
      }
    }
  }

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
}

export { generateText, REPEAT_DELAY_MS };
