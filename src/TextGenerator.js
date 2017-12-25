import "seedrandom";

import { PRODUCERS } from "./TextProducers";
const weighted = require("weighted");

Math.seedrandom();

function mostlyCenter(result) {
  const r = Math.floor(result.ratio * 100);
  var p;
  if (r < 5 || r > 95) {
    p = 1;
  } else if (r < 20 || r > 80) {
    p = 5;
  } else {
    p = 90;
  }
  return p / 100;
}

function canProgress(result) {
  return result.results.length > 5 && result.ratio > 0.5;
}

function depMet(results, dep) {
  return results.has(dep) && canProgress(results.get(dep).values()[0]);
}

function getCandidates(allResults, name, bootstrap, probabilityFunc) {
  var candidates = new Map();
  var results = allResults.get(name);
  if (!results) {
    candidates.set(bootstrap, 1);
    return candidates;
  }
  for (var k of results.keys()) {
    let res = results.get(k);
    k = parseInt(k, 10);
    candidates.set(k, probabilityFunc(res));
    if (canProgress(res)) {
      const nk = k + 1;
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

function fillSlot(results, pattern) {
  // weighted candidates to fill the slot with
  var candidates = [];
  var weights = [];
  // values returned by each candidate
  var values = new Map();
  for (const [name, { func, startSize, dep }] of PRODUCERS.entries()) {
    if (dep && !depMet(results, dep)) {
      continue;
    }
    let c = getCandidates(results, name, startSize, mostlyCenter);
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
    pattern = [];
    const { producer, value } = fillSlot(results, pattern);
    text += value;
    pattern.push(producer);
    hack++;
  } while (text === oldText && hack < 10);
  if (hack === 10) {
    text = "oops";
    pattern = [
      {
        producer: "fail",
        size: 1
      }
    ];
  }
  console.log("final text:", text, pattern.map(e => e.producer + ":" + e.size));
  return { text, pattern };
}

export default generateText;
