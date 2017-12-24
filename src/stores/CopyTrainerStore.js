import { action, extendObservable, observable } from "mobx";
import "seedrandom";

import { ResultTracker } from "./ResultTracker";
import { PRODUCERS } from "../TextProducers";
const weighted = require("weighted");

Math.seedrandom();

class CopyTrainerStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    extendObservable(this, {
      // 'repeats': { 1: resultTracker, 2: resultTracker },
      // 'letters': { 1: resultTracker },
      // 'words': { 1: resultTracker, 2: resultTracker },
      // ...
      producers: observable(new Map())
    });
  }

  getCandidates(results, bootstrap) {
    var candidates = {};
    if (!results) {
      return { [bootstrap]: 1 };
    }
    for (let k of results.keys()) {
      let res = results.get(k);
      candidates[k] = res.pickProbability;
      if (res.canProgress) {
        const nk = parseInt(k, 10) + 1;
        if (!(nk in candidates)) {
          candidates[nk] = 0.5;
        }
      }
    }
    if (!(bootstrap in candidates)) {
      candidates[bootstrap] = 1;
    }
    return candidates;
  }

  pickRepeater() {
    const candidates = this.getCandidates(this.producers.get("repeats"), 1);
    return parseInt(weighted.select(candidates), 10);
  }

  fillSlot(pattern, total, index) {
    // weighted candidates to fill the slot with
    var candidates = {};
    // values returned by each candidate
    var values = {};
    for (const func of PRODUCERS) {
      const name = func.producerName;
      let c = this.getCandidates(this.producers.get(name), 1);
      for (const [size, prob] of Object.entries(c)) {
        let val = func(parseInt(size, 10), pattern, total, index);
        // val is null if the producer doesn't work for these parameters
        if (val !== null) {
          const key = name + ":" + size;
          candidates[key] = prob;
          values[key] = val;
        }
      }
    }
    const winner = weighted.select(candidates);
    return { producer: winner, value: values[winner] };
  }

  generateText(oldPattern) {
    var text;
    var pattern;
    var hack = 0; // TODO: fix this
    do {
      text = "";
      const count = this.pickRepeater();
      pattern = ["repeats:" + count];
      for (let i = 0; i < count; i++) {
        const { producer, value } = this.fillSlot(pattern.slice(1), count, i);
        text += value;
        pattern.push(producer);
      }
      hack++;
    } while (pattern.toString() === oldPattern.toString() && hack < 10);
    if (hack === 10) {
      text = "oops";
      pattern = [1];
    }
    console.log("final text:", text, pattern);
    return { text, pattern };
  }

  recordFeedback = action((results, id, success, count) => {
    var tracker;
    if (!results.has(id)) {
      tracker = observable(new ResultTracker());
      results.set(id, tracker);
    } else {
      tracker = results.get(id);
    }
    tracker.record(success, count);
  });

  patternFeedback = action((pattern, success, count) => {
    for (let i = 0; i < pattern.length; i++) {
      const [producer, size] = pattern[i].split(":");
      if (!this.producers.has(producer)) {
        this.producers.set(producer, observable(new Map()));
      }
      this.recordFeedback(this.producers.get(producer), size, success, count);
    }
  });
}

export default CopyTrainerStore;
