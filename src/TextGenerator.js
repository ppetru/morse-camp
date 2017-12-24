import "seedrandom";

import { PRODUCERS } from "./TextProducers";
const weighted = require("weighted");

Math.seedrandom();

function pickProbability(result) {
  const r = Math.floor(result.ratio * 100);
  var p;
  if (r < 5 || r > 95) {
    p = 1;
  } else if (r < 20 || r > 80) {
    p = 10;
  } else {
    p = 80;
  }
  return p / 100;
}

function canProgress(result) {
  return result.results.length > 5 && result.ratio > 0.5;
}

function getCandidates(results, bootstrap) {
  var candidates = new Map();
  if (!results) {
    candidates.set(bootstrap, 1);
    return candidates;
  }
  for (let k of results.keys()) {
    let res = results.get(k);
    candidates.set(k, pickProbability(res));
    if (canProgress(res)) {
      const nk = parseInt(k, 10) + 1;
      if (!candidates.has(nk)) {
        candidates.set(nk, 0.5);
      }
    }
  }
  if (!candidates.has(bootstrap)) {
    candidates.set(bootstrap, 1);
  }
  return candidates;
}

function pickRepeater(results) {
  const candidates = getCandidates(results.get("repeats"), 1);
  return weighted.select(
    Array.from(candidates.keys()),
    Array.from(candidates.values())
  );
}

function fillSlot(results, pattern) {
  // weighted candidates to fill the slot with
  var candidates = [];
  var weights = [];
  // values returned by each candidate
  var values = new Map();
  for (const [name, { func, startSize }] of PRODUCERS.entries()) {
    let c = getCandidates(results.get(name), startSize);
    for (const [size, prob] of c.entries()) {
      let val = func(size, pattern);
      // val is null if the producer doesn't work for these parameters
      if (val !== null) {
        const key = {
          producer: name,
          size: size
        };
        candidates.push(key);
        weights.push(prob);
        values.set(key, val);
      }
    }
  }
  const winner = weighted.select(candidates, weights);
  return { producer: winner, value: values.get(winner) };
}

function generateText(results, oldText) {
  var text;
  var pattern;
  var hack = 0; // TODO: fix this
  do {
    text = "";
    const count = pickRepeater(results);
    pattern = [
      {
        producer: "repeats",
        size: count
      }
    ];
    for (let i = 0; i < count; i++) {
      const { producer, value } = fillSlot(results, pattern);
      text += value;
      pattern.push(producer);
    }
    hack++;
  } while (text === oldText && hack < 10);
  if (hack === 10) {
    text = "oops";
    pattern = [
      {
        producer: "repeats",
        size: 1
      }
    ];
  }
  console.log("final text:", text, pattern.map(e => e.producer + ":" + e.size));
  return { text, pattern };
}

export default generateText;
