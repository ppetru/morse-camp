import words from "./Words";

var producers = new Map();

function registerProducer(name, func, startSize, dep) {
  producers.set(name, {
    func: func,
    startSize: startSize,
    dep: dep
  });
}

function makeSymbolPicker(sizeLimit, symbols) {
  return (size, pattern) => {
    if (size > sizeLimit) {
      return null;
    }
    // only 1 symbol at a time
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
//registerProducer("letter", letterProducer, 1);

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
//registerProducer("digits", digitProducer, 1, "letter");

const punctuationProducer = makeSymbolPicker(1, [".", ",", "?"]);
registerProducer("punctuation", punctuationProducer, 1, "digits");

const prosignProducer = makeSymbolPicker(1, [
  "<AR>",
  "<AS>",
  "<BK>",
  "<CL>",
  "<KN>",
  "<SK>"
]);
//registerProducer("prosign", prosignProducer, 1, "punctuation");

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
