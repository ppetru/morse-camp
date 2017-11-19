import { words as cw } from './words/cw.js';
import { words as top5k } from './words/top5k.js';


function withSpacePrepender(func) {
  return (size, total, index) => {
    const result = func(size);
    if (result === null) {
      return null;
    }
    if (index > 0) {
      return " " + result;
    } else {
      return result;
    }
  }
}

function makeSingleSymbolProducer(symbols) {
  return withSpacePrepender((size) => {
    if (size === 1) {
      return symbols[Math.floor(Math.random() * symbols.length)];
    } else {
      return null;
    }
  })
}

const letterProducer = makeSingleSymbolProducer([
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
])

const DIGITS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

const digitProducer = withSpacePrepender((size) => {
  if (size > 3) {
    return null;
  }
  var group = "";
  for (let i = 0; i < size; i++) {
    group += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return group;
})
  
const punctuationProducer = makeSingleSymbolProducer([
  '.', ',', '?'
])

const prosignProducer = makeSingleSymbolProducer([
  '<AR>', '<AS>', '<BK>', '<CL>', '<KN>', '<SK>'
])

function makeWordProducer(wordMap) {
  return withSpacePrepender((size) => {
    return wordMap[size][Math.floor(Math.random() * wordMap[size].length)];
  })
}

function makeWordMap(words) {
  var map = [];

  words.forEach(w => {
    const len = w.length;
    if (len in map) {
      map[len].push(w);
    } else {
      map[len] = [ w ];
    }
  });

  return map;
}

const PRODUCERS = {
  'letters': letterProducer,
  'digits': digitProducer,
  'punctuation': punctuationProducer,
  'prosign': prosignProducer,
  'top5k': makeWordProducer(makeWordMap(top5k)),
  'cw': makeWordProducer(makeWordMap(cw)),
}

export { PRODUCERS };
