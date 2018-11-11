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
      effectiveSpeed: 30,
      characterSpeed: 30,
      frequency: 500,
      delay: 2500,
      maxRepeats: 15,
      activeDictionarySize: dictionary.wordFrequency.size,
      maxDictionarySize: dictionary.wordFrequency.size,
      types: dictionary.typesToIncludeByDefault,

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
          frequency: this.frequency,
          delay: this.delay,
          maxRepeats: this.maxRepeats,
          activeDictionarySize: this.activeDictionarySize,
          types: this.types
        };
      }
    });

    this.setupActiveDictionary();
    this.setupSettings("MorsePlayer", noDebounce);
  }

  includeCount = () => {
    var count = 0;

    Object.entries(this.types).forEach(([key, value]) => {
      if (value) {
        count++;
      }
    });

    return count;
  };

  setupActiveDictionary = () => {
    var types = [];

    for (var type in this.types) {
      if (this.types.hasOwnProperty(type) && this.types[type]) {
        types.push(type);
      }
    }

    dictionary.setActiveWords(types);
    this.setMaxDictionarySize(dictionary.wordType.size);
    if (this.activeDictionarySize > this.maxDictionarySize) {
      this.setActiveDictionarySize(this.maxDictionarySize);
    }
  };

  setFromJson = action(json => {
    this.setVolume(json.volume);
    this.setEffectiveSpeed(json.effectiveSpeed || 30);
    this.setCharacterSpeed(json.characterSpeed || 30);
    this.setFrequency(json.frequency);
    this.setDelay(json.delay);
    this.setMaxRepeats(json.maxRepeats);

    if (
      json.activeDictionarySize !== undefined &&
      json.activeDictionarySize !== null
    ) {
      this.setActiveDictionarySize(json.activeDictionarySize);
    }
    if (json.types !== undefined && json.types !== null) {
      this.setTypes(json.types);
    }
  });

  setVolume = action(volume => (this.volume = parseInt(volume, 10)));

  setCharacterSpeed = action(
    speed => (this.characterSpeed = parseInt(speed, 10))
  );

  setEffectiveSpeed = action(speed => {
    this.effectiveSpeed = parseInt(speed, 10);
    if (this.effectiveSpeed > this.characterSpeed) {
      this.effectiveSpeed = this.characterSpeed;
    }
  });

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

  setMaxDictionarySize = action(
    maxDictionarySize =>
      (this.maxDictionarySize = parseInt(maxDictionarySize, 10))
  );

  setTypes = action(types => {
    this.types = types;
    this.setupActiveDictionary();
  });

  setType = action((type, value) => {
    this.types[type] = value;
    this.setupActiveDictionary();
  });
}

export default MorseStore;
