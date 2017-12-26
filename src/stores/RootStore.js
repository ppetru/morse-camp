
import CopyTrainerStore from './CopyTrainerStore';
import MorseStore from './MorseStore';

class RootStore {
  constructor(transport) {
    this.copyTrainer = new CopyTrainerStore(this, transport)
    this.morse = new MorseStore(this, transport)
  }
}

export default RootStore;
