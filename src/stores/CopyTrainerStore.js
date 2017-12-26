import { action, extendObservable, observable } from "mobx";
import "seedrandom";

import { ResultTracker } from "./ResultTracker";

Math.seedrandom();

class CopyTrainerStore {
  constructor(rootStore, transport) {
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      minLength: 2,
      maxLength: 3,

      setMinLength: action(l => (this.minLength = l)),
      setMaxLength: action(l => (this.maxLength = l))
    });
  }
}

export default CopyTrainerStore;
