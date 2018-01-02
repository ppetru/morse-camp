import AppStore from "./AppStore";
import ReadTrainerStore from "./ReadTrainerStore";
import MorseStore from "./MorseStore";

class RootStore {
  constructor(transport) {
    this.appStore = new AppStore(this);
    this.readTrainer = new ReadTrainerStore(this, transport);
    this.morse = new MorseStore(this, transport);
  }
}

export default RootStore;
