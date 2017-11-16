import { words as cw } from './words/cw.js';
import { words as top5k } from './words/top5k.js';


function makeWordMap() {
  var map = [];

  map[1] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '.', ',', '?', '<AR>', '<AS>', '<BK>',
    '<CL>', '<KN>', '<SK>',
  ];

  function registerWord(w) {
    const len = w.length;
    if (len in map) {
      map[len].push(w);
    } else {
      map[len] = [ w ];
    }
  }

  cw.forEach(registerWord);
  top5k.forEach(registerWord);

  return map;
}

const wordMap = makeWordMap();

function pickWord(length, previous) {
  var w;
  do {
    w = wordMap[length][Math.floor(Math.random() * wordMap[length].length)];
  } while (w === previous);
  return w;
};

export { pickWord };
