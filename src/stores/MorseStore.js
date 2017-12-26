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

      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
      }),

      get asJson() {
        return {
          speed: this.speed,
          frequency: this.frequency
        };
      }
    });

    this.setupSettings("morsePlayer", noDebounce);
  }

  setFromJson = action(json => {
    this.setSpeed(json.speed);
    this.setFrequency(json.frequency);
  });

  setSpeed = action(speed => (this.speed = parseInt(speed, 10)));

  setFrequency = action(
    frequency => (this.frequency = parseInt(frequency, 10))
  );
}

export default MorseStore;
