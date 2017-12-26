import "seedrandom";
const weighted = require("weighted");

Math.seedrandom();

function generateText(store, wordsBySize, oldText) {
  var words = [];
  var weights = [];
  for (let i = store.minLength; i <= store.maxLength; i++) {
    if (wordsBySize.has(i)) {
      let map = wordsBySize.get(i);
      words.push(...map.keys());
      weights.push(...map.values());
    }
  }

  if (words.length > 0) {
    return weighted.select(words, weights);
  } else {
    return null;
  }
}

export default generateText;
