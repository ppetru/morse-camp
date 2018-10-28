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
      includeWords: true,
      includeAbbreviations: true,
      includeQCodes: true,
      includeNumbers: true,
      includeYears: true,
      includeUSNames: false,
      includeCountries: false,

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
          includeWords: this.includeWords,
          includeAbbreviations: this.includeAbbreviations,
          includeQCodes: this.includeQCodes,
          includeNumbers: this.includeNumbers,
          includeYears: this.includeYears,
          includeUSNames: this.includeUSNames,
          includeUSStateAbbreviations: this.includeUSStateAbbreviations,
          includeCountries: this.includeCountries
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
    this.setIncludeWords(json.includeWords);
    this.setIncludeAbbreviations(json.includeAbbreviations);
    this.setIncludeQCodes(json.includeQCodes);
    this.setIncludeNumbers(json.includeNumbers);
    this.setIncludeYears(json.includeYears);
    this.setIncludeUSNames(json.includeUSNames);
    this.setIncludeUSStateAbbreviations(json.includeUSStateAbbreviations);
    this.setIncludeCountries(json.includeCountries);

    const include = [];
    if (this.includeWords) {
      include.push("Word");
    }
    if (this.includeAbbreviations) {
      include.push("abbreviation");
    }
    if (this.includeQCodes) {
      include.push("Q Code");
    }
    if (this.includeNumbers) {
      include.push("Number");
    }
    if (this.includeYears) {
      include.push("Year");
    }
    if (this.includeUSNames) {
      include.push("US Name");
    }
    if (this.includeUSStateAbbreviations) {
      include.push("US State Abbreviation");
    }
    if (this.includeCountries) {
      include.push("Country");
    }
    dictionary.setActiveWords(include);
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

  setIncludeWords = action(includeWords => (this.includeWords = includeWords));

  setIncludeAbbreviations = action(
    includeAbbreviations => (this.includeAbbreviations = includeAbbreviations)
  );

  setIncludeQCodes = action(
    includeQCodes => (this.includeQCodes = includeQCodes)
  );

  setIncludeNumbers = action(
    includeNumbers => (this.includeNumbers = includeNumbers)
  );

  setIncludeYears = action(includeYears => (this.includeYears = includeYears));

  setIncludeUSNames = action(
    includeUSNames => (this.includeUSNames = includeUSNames)
  );

  setIncludeUSStateAbbreviations = action(
    includeUSStateAbbreviations =>
      (this.includeUSStateAbbreviations = includeUSStateAbbreviations)
  );

  setIncludeCountries = action(
    includeCountries => (this.includeCountries = includeCountries)
  );
}

export default MorseStore;
