
import CopyTrainerStore from './CopyTrainerStore';
import MorseStore from './MorseStore';

class RootStore {
  constructor() {
    this.copyTrainer = new CopyTrainerStore(this)
    this.morse = new MorseStore(this)
  }
}

export default RootStore;
