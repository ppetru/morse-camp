import { words as cw } from "./words/cw.js";
import { words as top5k } from "./words/top5k.js";

var producers = {};

function withSpacePrepender(func) {
  return (size, pattern, total, index) => {
    const result = func(size, pattern, total, index);
    if (result === null) {
      return null;
    }
    if (index > 0) {
      return " " + result;
    } else {
      return result;
    }
  };
}

function withSizeLimit(limit, func) {
  return (size, pattern, total, index) => {
    if (size <= limit) {
      return func(size, pattern, total, index);
    } else {
      return null;
    }
  };
}

function withCountLimit(name, limit, func) {
  return (size, pattern, total, index) => {
    const count = pattern.filter(p => p.producer === name).length;
    if (count < limit) {
      return func(size, pattern, total, index);
    } else {
      return null;
    }
  };
}

function withSingleton(func) {
  return (size, pattern, total, index) => {
    if (total === 1) {
      return func(size, pattern, total, index);
    } else {
      return null;
    }
  };
}

function makeSymbolPicker(symbols) {
  return (size, pattern, total, index) => {
    var group = "";
    for (let i = 0; i < size; i++) {
      group += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return group;
  };
}

const letterProducer = withSingleton(
  withSizeLimit(
    1,
    makeSymbolPicker([
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
    ])
  )
);
producers["letter"] = letterProducer;

const digitProducer = withSpacePrepender(
  withSizeLimit(
    3,
    makeSymbolPicker(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
  )
);
producers["digits"] = digitProducer;

const punctuationProducer = withSpacePrepender(
  withCountLimit(
    "punctuation",
    1,
    withSizeLimit(1, makeSymbolPicker([".", ",", "?"]))
  )
);
producers["punctuation"] = punctuationProducer;

const prosignProducer = withSpacePrepender(
  withCountLimit(
    "prosign",
    1,
    withSizeLimit(
      1,
      makeSymbolPicker(["<AR>", "<AS>", "<BK>", "<CL>", "<KN>", "<SK>"])
    )
  )
);
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
  return withSpacePrepender(
    withSizeLimit(maxLen, (size, pattern, total, index) => {
      return map[size][Math.floor(Math.random() * map[size].length)];
    })
  );
}

producers["top5k"] = makeWordProducer(top5k);

producers["cw"] = makeWordProducer(cw);

const PRODUCERS = producers;

export { PRODUCERS };
