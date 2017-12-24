import { words as cw } from "./words/cw.js";
import { words as top5k } from "./words/top5k.js";

var producers = {};

function makeSymbolPicker(sizeLimit, symbols) {
  return (size, pattern) => {
    if (size > sizeLimit) {
      return null;
    }
    if (pattern[0].size !== 1) {
      return null;
    }
    var group;
    if (pattern.length > 1) {
      group = " ";
    } else {
      group = "";
    }
    for (let i = 0; i < size; i++) {
      group += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return group;
  };
}

const letterProducer = makeSymbolPicker(1, [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
]);
producers["letter"] = letterProducer;

const digitProducer = makeSymbolPicker(3, [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
]);
producers["digits"] = digitProducer;

const punctuationProducer = makeSymbolPicker(1, [".", ",", "?"]);
producers["punctuation"] = punctuationProducer;

const prosignProducer = makeSymbolPicker(1, [
  "<AR>",
  "<AS>",
  "<BK>",
  "<CL>",
  "<KN>",
  "<SK>"
]);
producers["prosign"] = prosignProducer;

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
    return prefix + map[size][Math.floor(Math.random() * map[size].length)];
  };
}

producers["top5k"] = makeWordProducer(top5k);

producers["cw"] = makeWordProducer(cw);

const PRODUCERS = producers;

export { PRODUCERS };
