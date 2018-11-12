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
      variableFrequency: false,
      frequency: 500,
      upperBoundFrequency: 800,
      lowerBoundFrequency: 400,

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
          variableFrequency: this.variableFrequency,
          frequency: this.frequency,
          upperBoundFrequency: this.upperBoundFrequency,
          lowerBoundFrequency: this.lowerBoundFrequency
        };
      }
    });

    this.setupSettings("MorsePlayer", noDebounce);
  }

  setFromJson = action(json => {
    this.setVolume(json.volume);
    this.setCharacterSpeed(json.characterSpeed || 30);
    this.setEffectiveSpeed(json.effectiveSpeed || 30);
    this.setVariableFrequency(json.variableFrequency || false);
    this.setFrequency(json.frequency);
    this.setUpperBoundFrequency(json.upperBoundFrequency || 800);
    this.setLowerBoundFrequency(json.lowerBoundFrequency || 400);
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

  setVariableFrequency = action(variableFrequency => {
    this.variableFrequency = variableFrequency;
  });

  setFrequency = action(
    frequency => (this.frequency = parseInt(frequency, 10))
  );

  setUpperBoundFrequency = action(upperBoundFrequency => {
    this.upperBoundFrequency = upperBoundFrequency;
    if (this.lowerBoundFrequency > this.upperBoundFrequency) {
      this.lowerBoundFrequency = this.upperBoundFrequency;
    }
  });

  setLowerBoundFrequency = action(lowerBoundFrequency => {
    this.lowerBoundFrequency = lowerBoundFrequency;
    if (this.lowerBoundFrequency > this.upperBoundFrequency) {
      this.lowerBoundFrequency = this.upperBoundFrequency;
    }
  });
}

export default MorseStore;
