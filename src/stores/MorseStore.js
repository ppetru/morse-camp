import { action, extendObservable } from "mobx";

class MorseStore {
  constructor(rootStore) {
    this.rootStore = rootStore;

    extendObservable(this, {
      playing: false,
      speed: 30,
      frequency: 500,

      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
      }),
      setSpeed: action(speed => (this.speed = speed)),
      setFrequency: action(frequency => (this.frequency = frequency))
    });
  }
}

export default MorseStore;
