import { action, extendObservable } from "mobx";
import { dictionary } from "../Words";
import SettingsSaver from "./SettingsSaver";

class MorseStore extends SettingsSaver {
  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      volume: 80,
      playing: false,
      speed: 30,
      frequency: 500,
      delay: 2500,
      maxRepeats: 15,
      activeDictionarySize: dictionary.wordFrequency.size,

      startedPlaying: action(() => {
        this.playing = true;
      }),
      stoppedPlaying: action(() => {
        this.playing = false;
      }),

      get asJson() {
        return {
          volume: this.volume,
          speed: this.speed,
          frequency: this.frequency,
          delay: this.delay,
          maxRepeats: this.maxRepeats,
          activeDictionarySize: this.activeDictionarySize
        };
      }
    });

    this.setupSettings("MorsePlayer", noDebounce);
  }

  setFromJson = action(json => {
    this.setVolume(json.volume);
    this.setSpeed(json.speed);
    this.setFrequency(json.frequency);
    this.setDelay(json.delay);
    this.setMaxRepeats(json.maxRepeats);
    this.setActiveDictionarySize(json.activeDictionarySize);
  });

  setVolume = action(volume => (this.volume = parseInt(volume, 10)));

  setSpeed = action(speed => (this.speed = parseInt(speed, 10)));

  setFrequency = action(
    frequency => (this.frequency = parseInt(frequency, 10))
  );

  setDelay = action(delay => (this.delay = parseInt(delay, 10)));

  setMaxRepeats = action(
    maxRepeats => (this.maxRepeats = parseInt(maxRepeats, 10))
  );

  setActiveDictionarySize = action(
    activeDictionarySize =>
      (this.activeDictionarySize = parseInt(activeDictionarySize, 10))
  );
}

export default MorseStore;
