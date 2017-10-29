import { action, extendObservable } from 'mobx';

class MorseStore {
  constructor(rootStore) {
    this.rootStore = rootStore

    extendObservable(this, {
      playing: false,

      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
        this.stopRequest = false;
      }),
    })
  }
}

export default MorseStore;
