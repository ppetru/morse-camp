import AppStore from "./AppStore.js";
import ReadTrainerStore from "./ReadTrainerStore.js";
import MorseStore from "./MorseStore.js";

class RootStore {
  constructor(transport) {
    this.transport = transport;

    this.appStore = new AppStore(this);
    this.readTrainer = new ReadTrainerStore(this, transport);
    this.morse = new MorseStore(this, transport);
  }
}

export default RootStore;
