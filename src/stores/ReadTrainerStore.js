import { autorun, makeObservable, observable, action, computed } from "mobx";

import SettingsSaver from "./SettingsSaver.js";
import { dictionary } from "../Words.js";

// https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
const ewma = (avg, newVal, alpha = 0.3) => {
  return alpha * newVal + (1 - alpha) * avg;
};

class ReadTrainerStore extends SettingsSaver {
  WORD_PREFIX = "rw-";
  LENGTH_PREFIX = "rl-";

  minLength = 2;
  maxLength = 2;
  words = observable.map();
  lengths = observable.map();
  automaticallyRepeat = true;
  automaticallyIncreaseDifficulty = true;
  delay = 2500;
  maxRepeats = 15;
  activeDictionarySize = dictionary.wordFrequency.size;
  maxDictionarySize = dictionary.wordFrequency.size;
  types = dictionary.typesToIncludeByDefault;
  useUserDictionary = false;
  userDictionary = observable.map();

  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    makeObservable(this, {
      minLength: observable,
      maxLength: observable,
      words: observable,
      lengths: observable,
      automaticallyRepeat: observable,
      automaticallyIncreaseDifficulty: observable,
      delay: observable,
      maxRepeats: observable,
      activeDictionarySize: observable,
      maxDictionarySize: observable,
      types: observable,
      useUserDictionary: observable,
      userDictionary: observable,
      asJson: computed,
      canUseUserDictionary: computed,
      userDictionaryAsText: computed,
      userDictionaryWithWordFreq: computed,
      setFromJson: action,
      includeCount: action,
      setupActiveDictionary: action,
      setMinLength: action,
      setMaxLength: action,
      setDelay: action,
      setAutomaticallyRepeat: action,
      setAutomaticallyIncreaseDifficulty: action,
      setMaxRepeats: action,
      setActiveDictionarySize: action,
      setMaxDictionarySize: action,
      setTypes: action,
      setType: action,
      setUseUserDictionary: action,
      setUserDictionary: action,
      setUserDictionaryFromText: action,
      setWordData: action,
      wordFeedback: action,
      setLengthData: action,
      lengthFeedback: action,
      textFeedback: action,
      resetLengthCount: action,
      adjustLengths: action,
    });

    this.setupActiveDictionary();
    this.setupSettings("ReadTrainer", noDebounce);

    this.loadWords = this.transport.iteratePrefix(this.WORD_PREFIX, (w, d) =>
      this.setWordData(w, d),
    );
    this.wordPersister = autorun(() => {
      for (const [k, v] of this.words.entries()) {
        this.transport.setIfDifferent(this.WORD_PREFIX + k, v);
      }
    });

    this.loadLengths = this.transport.iteratePrefix(
      this.LENGTH_PREFIX,
      (l, d) => this.setLengthData(l, d),
    );
    this.lengthPersister = autorun(() => {
      for (const [k, v] of this.lengths.entries()) {
        this.transport.setIfDifferent(this.LENGTH_PREFIX + k, v);
      }
    });
  }

  // TODO: adding new things is a lot of boilerplate. Is there a better way to serialize things?
  get asJson() {
    return {
      minLength: this.minLength,
      maxLength: this.maxLength,
      automaticallyRepeat: this.automaticallyRepeat,
      automaticallyIncreaseDifficulty: this.automaticallyIncreaseDifficulty,
      delay: this.delay,
      maxRepeats: this.maxRepeats,
      activeDictionarySize: this.activeDictionarySize,
      types: this.types,
      useUserDictionary: this.useUserDictionary,
      userDictionary: JSON.stringify([...this.userDictionary]),
    };
  }

  get canUseUserDictionary() {
    return this.useUserDictionary && [...this.userDictionary.keys()].length > 0;
  }

  get userDictionaryAsText() {
    return [...this.userDictionary.keys()].join("\n");
  }

  get userDictionaryWithWordFreq() {
    return this.userDictionary;
  }

  setFromJson = (json) => {
    const propDefaults = {
      minLength: 2,
      maxLength: 2,
      automaticallyRepeat: true,
      automaticallyIncreaseDifficulty: true,
      delay: 2500,
      maxRepeats: 15,
      useUserDictionary: false,
      activeDictionarySize: undefined,
      types: undefined,
    };
    for (let prop in propDefaults) {
      var value = propDefaults[prop];
      if (prop in json) {
        value = json[prop];
      }
      // fooBar -> setFooBar
      this["set" + prop.charAt(0).toUpperCase() + prop.slice(1)](value);
    }

    if (json.userDictionary) {
      this.setUserDictionary(new Map(JSON.parse(json.userDictionary)));
    } else {
      this.setUserDictionary(new Map());
    }
  };

  includeCount = () => {
    var count = 0;

    Object.entries(this.types).forEach(([key, value]) => {
      if (value) {
        count++;
      }
    });

    return count;
  };

  // This is used to setup the built-in active dictionary, which can be trimmed
  // as configured by the user.
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

  setMinLength = (l) => {
    var n = parseInt(l, 10);
    if (isNaN(n) || n < 2) {
      n = 2;
    }
    this.minLength = n;
    if (this.minLength > this.maxLength) {
      this.maxLength = this.minLength;
    }
  };

  setMaxLength = (l) => {
    var n = parseInt(l, 10);
    if (isNaN(n) || n < 2) {
      n = 2;
    }
    this.maxLength = n;
    if (this.maxLength < this.minLength) {
      this.minLength = this.maxLength;
    }
  };

  setDelay = (delay) => (this.delay = parseInt(delay, 10));

  setAutomaticallyRepeat = (automaticallyRepeat) =>
    (this.automaticallyRepeat = automaticallyRepeat);

  setAutomaticallyIncreaseDifficulty = (automaticallyIncreaseDifficulty) =>
    (this.automaticallyIncreaseDifficulty = automaticallyIncreaseDifficulty);

  setMaxRepeats = (maxRepeats) => (this.maxRepeats = parseInt(maxRepeats, 10));

  setActiveDictionarySize = (activeDictionarySize) =>
    (this.activeDictionarySize = parseInt(activeDictionarySize, 10));

  setMaxDictionarySize = (maxDictionarySize) =>
    (this.maxDictionarySize = parseInt(maxDictionarySize, 10));

  setTypes = (types) => {
    this.types = types;
    this.setupActiveDictionary();
  };

  setType = (type, value) => {
    this.types[type] = value;
    this.setupActiveDictionary();
  };

  setUseUserDictionary = (value) => (this.useUserDictionary = value);
  setUserDictionary = (values) => (this.userDictionary = values);

  setUserDictionaryFromText(text) {
    let words = observable.map();

    function addWord(word) {
      if (word === "") {
        return;
      }

      let frequency = words.get(word) === undefined ? 1 : words.get(word) + 1;
      words.set(word, frequency);
    }

    text
      .split(/[ \n,]/)
      .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
      .forEach((word) => addWord(word));

    this.setUserDictionary(words);
  }

  setWordData = (w, data) => {
    this.words.set(w, data);
  };

  wordFeedback = (word, success, count, time) => {
    let avgScore;
    let score = success / count;

    if (this.words.has(word)) {
      avgScore = ewma(this.words.get(word).score, score);
    } else {
      avgScore = score;
    }

    this.setWordData(word, {
      score: avgScore,
      time: time,
    });
  };

  setLengthData = (len, data) => {
    this.lengths.set(len, data);
  };

  lengthFeedback = (len, success, tryCount) => {
    let avgScore;
    let newCount = 1;
    let newScore = success / tryCount;

    if (this.lengths.has(len)) {
      const { score, count } = this.lengths.get(len);
      avgScore = ewma(score, newScore);
      newCount += count;
    } else {
      avgScore = newScore;
    }
    this.setLengthData(len, {
      score: avgScore,
      count: newCount,
    });

    while (--len >= dictionary.minWordLength) {
      if (this.lengths.has(len)) {
        const { score, count } = this.lengths.get(len);
        if (newScore >= score) {
          this.setLengthData(len, {
            score: ewma(score, newScore),
            count: count + 1,
          });
        }
      }
    }
  };

  textFeedback = (text, success, count, time) => {
    text.split(" ").forEach((w) => this.wordFeedback(w, success, count, time));
    this.lengthFeedback(text.length, success, count);
  };

  resetLengthCount = (len) => {
    if (this.lengths.has(len)) {
      const { score } = this.lengths.get(len);
      this.setLengthData(len, {
        score: score,
        count: 0,
      });
    }
  };

  adjustLengths = () => {
    if (this.lengths.has(this.minLength)) {
      const { score, count } = this.lengths.get(this.minLength);
      if (count > 4) {
        if (score > 0.8) {
          this.setMinLength(this.minLength + 1);
          // TODO: this resets even when minLength didn't change (bottom cap). worth fixing?
          // (same problem for maxLength)
          this.resetLengthCount(this.minLength);
        } else if (score < 0.2) {
          this.setMinLength(this.minLength - 1);
          this.resetLengthCount(this.minLength);
        }
      }
    }

    if (this.lengths.has(this.maxLength)) {
      const { score, count } = this.lengths.get(this.maxLength);
      if (count > 4) {
        if (score > 0.5) {
          this.setMaxLength(this.maxLength + 1);
          this.resetLengthCount(this.maxLength);
        } else if (score < 0.1) {
          this.setMaxLength(this.maxLength - 1);
          this.resetLengthCount(this.maxLength);
        }
      }
    }
  };
}

export default ReadTrainerStore;
