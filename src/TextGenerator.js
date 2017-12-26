import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

function generateText(store, wordsBySize) {
  var words = [];
  var weights = [];
  for (let i = store.minLength; i <= store.maxLength; i++) {
    if (wordsBySize.has(i)) {
      for (const [word, freq] of wordsBySize.get(i)) {
        if (!store.words.has(word) || store.words.get(word) !== 1) {
          words.push(word);
          weights.push(freq);
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

export default generateText;
