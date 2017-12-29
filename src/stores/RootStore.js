import AppStore from "./AppStore";
import CopyTrainerStore from "./CopyTrainerStore";
import MorseStore from "./MorseStore";

class RootStore {
  constructor(transport) {
    this.appStore = new AppStore(this);
    this.copyTrainer = new CopyTrainerStore(this, transport);
    this.morse = new MorseStore(this, transport);
  }
}

export default RootStore;
