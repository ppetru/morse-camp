import { action, extendObservable } from "mobx";
import SettingsSaver from "./SettingsSaver";

class MorseStore extends SettingsSaver {
  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      volume: 80,
      playing: false,
      effectiveSpeed: 30,
      characterSpeed: 30,
      frequency: 500,

      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
      }),

      get asJson() {
        return {
          volume: this.volume,
          effectiveSpeed: this.effectiveSpeed,
          characterSpeed: this.characterSpeed,
          frequency: this.frequency
        };
      }
    });

    this.setupSettings("MorsePlayer", noDebounce);
  }

  setFromJson = action(json => {
    this.setVolume(json.volume);
    this.setCharacterSpeed(json.characterSpeed || 30);
    this.setEffectiveSpeed(json.effectiveSpeed || 30);
    this.setFrequency(json.frequency);
  });

  setVolume = action(volume => (this.volume = parseInt(volume, 10)));

  setCharacterSpeed = action(speed => {
    this.characterSpeed = parseInt(speed, 10);
    if (this.effectiveSpeed > this.characterSpeed) {
      this.effectiveSpeed = this.characterSpeed;
    }
  });

  setEffectiveSpeed = action(speed => {
    this.effectiveSpeed = parseInt(speed, 10);
    if (this.effectiveSpeed > this.characterSpeed) {
      this.effectiveSpeed = this.characterSpeed;
    }
  });

  setFrequency = action(
    frequency => (this.frequency = parseInt(frequency, 10))
  );
}

export default MorseStore;
