import words from "./Words";

var producers = new Map();

function registerProducer(name, func, startSize, dep) {
  producers.set(name, {
    func: func,
    startSize: startSize,
    dep: dep
  });
}

function makeWordMap(words) {
  var map = [];
  var maxLen = 0;

  words.forEach(w => {
    const len = w.length;
    if (len in map) {
      map[len].push(w);
    } else {
      map[len] = [w];
    }
    if (len > maxLen) {
      maxLen = len;
    }
  });

  return { map, maxLen };
}

function makeWordProducer(words) {
  const { map, maxLen } = makeWordMap(words);
  return (size, pattern) => {
    if (size > maxLen) {
      return null;
    }
    var prefix;
    if (pattern.length > 1) {
      prefix = " ";
    } else {
      prefix = "";
    }
    if (!(size in map)) {
      return null;
    }
    return prefix + map[size][Math.floor(Math.random() * map[size].length)];
  };
}

registerProducer("words", makeWordProducer(words), 2);

const PRODUCERS = producers;

export { PRODUCERS };
