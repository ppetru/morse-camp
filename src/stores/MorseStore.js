import { makeAutoObservable } from "mobx";
import SettingsSaver from "./SettingsSaver";

class MorseStore extends SettingsSaver {
  volume = 80;
  playing = false;
  effectiveSpeed = 30;
  characterSpeed = 30;
  randomFrequency = false;
  frequency = 500;
  upperBoundFrequency = 800;
  lowerBoundFrequency = 400;

  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    makeAutoObservable(this, {
      rootStore: false,
      transport: false,
    });

    this.setupSettings("MorsePlayer", noDebounce);
  }

  get asJson() {
    return {
      volume: this.volume,
      effectiveSpeed: this.effectiveSpeed,
      characterSpeed: this.characterSpeed,
      randomFrequency: this.randomFrequency,
      frequency: this.frequency,
      upperBoundFrequency: this.upperBoundFrequency,
      lowerBoundFrequency: this.lowerBoundFrequency,
    };
  }

  startedPlaying = () => {
    this.playing = true;
  };

  stoppedPlaying = () => {
    this.playing = false;
  };

  setFromJson = (json) => {
    this.setVolume(json.volume);
    this.setCharacterSpeed(json.characterSpeed || 30);
    this.setEffectiveSpeed(json.effectiveSpeed || 30);
    this.setRandomFrequency(json.randomFrequency || false);
    this.setFrequency(json.frequency);
    this.setUpperBoundFrequency(json.upperBoundFrequency || 800);
    this.setLowerBoundFrequency(json.lowerBoundFrequency || 400);
  };

  setVolume = (volume) => (this.volume = parseInt(volume, 10));

  setCharacterSpeed = (speed) => {
    this.characterSpeed = parseInt(speed, 10);
    if (this.effectiveSpeed > this.characterSpeed) {
      this.effectiveSpeed = this.characterSpeed;
    }
  };

  setEffectiveSpeed = (speed) => {
    this.effectiveSpeed = parseInt(speed, 10);
    if (this.effectiveSpeed > this.characterSpeed) {
      this.effectiveSpeed = this.characterSpeed;
    }
  };

  setRandomFrequency = (randomFrequency) => {
    this.randomFrequency = randomFrequency;
  };

  setFrequency = (frequency) => (this.frequency = parseInt(frequency, 10));

  setUpperBoundFrequency = (upperBoundFrequency) => {
    this.upperBoundFrequency = upperBoundFrequency;
    if (this.lowerBoundFrequency > this.upperBoundFrequency) {
      this.lowerBoundFrequency = this.upperBoundFrequency;
    }
  };

  setLowerBoundFrequency = (lowerBoundFrequency) => {
    this.lowerBoundFrequency = lowerBoundFrequency;
    if (this.lowerBoundFrequency > this.upperBoundFrequency) {
      this.lowerBoundFrequency = this.upperBoundFrequency;
    }
  };
}

export default MorseStore;
