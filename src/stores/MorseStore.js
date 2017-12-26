import { action, extendObservable, reaction } from "mobx";

class MorseStore {
  constructor(rootStore, transport) {
    this.rootStore = rootStore;
    this.transport = transport;

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
      setSpeed: action(speed => (this.speed = parseInt(speed, 10))),
      setFrequency: action(
        frequency => (this.frequency = parseInt(frequency, 10))
      ),

      get asJson() {
        return {
          speed: this.speed,
          frequency: this.frequency
        };
      }
    });

    this.transport.loadMorse().then(json => {
      if (json) {
        this.setSpeed(json.speed);
        this.setFrequency(json.frequency);
      }
    });

    this.saveHandler = reaction(
      () => this.asJson,
      json => this.transport.saveMorse(json),
      { delay: 500 }
    );
  }
}

export default MorseStore;
