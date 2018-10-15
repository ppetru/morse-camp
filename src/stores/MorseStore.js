import { action, extendObservable } from "mobx";

import SettingsSaver from "./SettingsSaver";

class MorseStore extends SettingsSaver {
  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      playing: false,
      speed: 30,
      frequency: 500,
      delay: 2000,
      maxRepeats: 5,

      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
      }),

      get asJson() {
        return {
          speed: this.speed,
          frequency: this.frequency,
          delay: this.delay,
          maxRepeats: this.maxRepeats
        };
      }
    });

    this.setupSettings("MorsePlayer", noDebounce);
  }

  setFromJson = action(json => {
    this.setSpeed(json.speed);
    this.setFrequency(json.frequency);
    this.setDelay(json.delay);
    this.setMaxRepeats(json.maxRepeats);
  });

  setSpeed = action(speed => (this.speed = parseInt(speed, 10)));

  setFrequency = action(
    frequency => (this.frequency = parseInt(frequency, 10))
  );

  setDelay = action(
    delay => (this.delay = parseInt(delay, 10))
  );

  setMaxRepeats = action(
    maxRepeats => (this.maxRepeats = parseInt(maxRepeats, 10))
  );
}

export default MorseStore;
