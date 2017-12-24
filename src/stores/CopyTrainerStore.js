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
        const nk = k + 1;
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
    return weighted.select(candidates);
  }

  fillSlot(pattern) {
    // weighted candidates to fill the slot with
    var candidates = [];
    var weights = [];
    // values returned by each candidate
    var values = new Map();
    for (const [name, func] of Object.entries(PRODUCERS)) {
      let c = this.getCandidates(this.producers.get(name), 1);
      for (const [size, prob] of Object.entries(c)) {
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

  generateText(oldPattern) {
    var text;
    var pattern;
    var hack = 0; // TODO: fix this
    do {
      text = "";
      const count = this.pickRepeater();
      pattern = [
        {
          producer: "repeats",
          size: count
        }
      ];
      for (let i = 0; i < count; i++) {
        const { producer, value } = this.fillSlot(pattern);
        text += value;
        pattern.push(producer);
      }
      hack++;
    } while (
      JSON.stringify(pattern) === JSON.stringify(oldPattern) &&
      hack < 10
    );
    if (hack === 10) {
      text = "oops";
      pattern = [
        {
          producer: "repeats",
          size: 1
        }
      ];
    }
    console.log(
      "final text:",
      text,
      pattern.map(e => e.producer + ":" + e.size)
    );
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
    for (let e of pattern) {
      if (!this.producers.has(e.producer)) {
        this.producers.set(e.producer, observable(new Map()));
      }
      this.recordFeedback(
        this.producers.get(e.producer),
        e.size,
        success,
        count
      );
    }
  });
}

export default CopyTrainerStore;
