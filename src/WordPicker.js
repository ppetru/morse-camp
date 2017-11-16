import { words as cw } from './words/cw.js';
import { words as top5k } from './words/top5k.js';


function makeWordMap() {
  var map = [];

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

function pickWord(length) {
  let w = wordMap[length][Math.floor(Math.random() * wordMap[length].length)];
  console.log(w);
  return w;
};

export { pickWord };
