import { action, extendObservable } from 'mobx';

class MorseStore {
  constructor(rootStore) {
    this.rootStore = rootStore

    extendObservable(this, {
      morseText: "",
      playing: false,
      stopRequest: false,

      playText: action(text => {
        this.morseText = text;
      }),
      clearText: action(() => {
        this.morseText = "";
      }),
      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
        this.stopRequest = false;
      }),
      requestStopPlaying: action(() => {
        this.stopRequest = true;
      }),
    })
  }
}

export default MorseStore;
