import { action, extendObservable, observable } from "mobx";
import "seedrandom";

import { ResultTracker } from "./ResultTracker";

Math.seedrandom();

class CopyTrainerStore {
  constructor(rootStore, transport) {
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      // 'repeats': { 1: resultTracker, 2: resultTracker },
      // 'letters': { 1: resultTracker },
      // 'words': { 1: resultTracker, 2: resultTracker },
      // ...
      producers: observable(new Map())
    });
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
