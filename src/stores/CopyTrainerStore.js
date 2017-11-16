import { extendObservable } from 'mobx';

class CopyTrainerStore {
  constructor(rootStore) {
    this.rootStore = rootStore

    extendObservable(this, {
    })
  }
}

export default CopyTrainerStore;
