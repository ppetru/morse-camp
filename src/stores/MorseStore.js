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
          speed: this.speed,
          frequency: this.frequency,
          delay: this.delay,
          maxRepeats: this.maxRepeats,
          activeDictionarySize: this.activeDictionarySize,
          types: this.types
        };
      }
    });

    this.setActiveDictionary();
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

  sanityCheckActiveDictionarySize = () => {
    if (this.activeDictionarySize >= dictionary.wordType.size) {
      this.setActiveDictionarySize(dictionary.wordType.size);
    } else {
      //The Slider component needs a little bit of time to pickup the change
      this.setActiveDictionarySize(this.activeDictionarySize + 1);
      setTimeout(() => {
        this.setActiveDictionarySize(this.activeDictionarySize - 1);
      }, 10);
    }
  };

  setActiveDictionary = () => {
    var types = [];

    for (var type in this.types) {
      if (this.types.hasOwnProperty(type) && this.types[type]) {
        types.push(type);
      }
    }

    dictionary.setActiveWords(types);

    if (this.activeDictionarySize > dictionary.wordType.size) {
      this.setActiveDictionarySize(dictionary.wordType.size);
    }
  };

  setFromJson = action(json => {
    this.setVolume(json.volume);
    this.setSpeed(json.speed);
    this.setFrequency(json.frequency);
    this.setDelay(json.delay);
    this.setMaxRepeats(json.maxRepeats);
    this.setActiveDictionarySize(json.activeDictionarySize);
    this.setTypes(json.types);

    this.setActiveDictionary();
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

  setTypes = action(types => (this.types = types));
  setType = action((type, value) => (this.types[type] = value));

  setIncludeWords = action(includeWords => this.setType("Word", includeWords));

  setIncludeAbbreviations = action(includeAbbreviations =>
    this.setType("Abbreviation", includeAbbreviations)
  );

  setIncludeQCodes = action(includeQCodes =>
    this.setType("Q Code", includeQCodes)
  );

  setIncludeNumbers = action(includeNumbers =>
    this.setType("Number", includeNumbers)
  );

  setIncludeYears = action(includeYears => this.setType("Year", includeYears));

  setIncludeUSNames = action(includeUSNames =>
    this.setType("US Name", includeUSNames)
  );

  setIncludeUSStateAbbreviations = action(includeUSStateAbbreviations =>
    this.setType("US State Abbreviation", includeUSStateAbbreviations)
  );

  setIncludeCountries = action(includeCountries =>
    this.setType("Country", includeCountries)
  );
}

export default MorseStore;
