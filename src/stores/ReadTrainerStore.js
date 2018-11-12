import { action, autorun, extendObservable, observable } from "mobx";

import SettingsSaver from "./SettingsSaver";
import { dictionary } from "../Words";

// https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
const ewma = (avg, newVal, alpha = 0.3) => {
  return alpha * newVal + (1 - alpha) * avg;
};

class ReadTrainerStore extends SettingsSaver {
  WORD_PREFIX = "rw-";
  LENGTH_PREFIX = "rl-";

  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      minLength: 2,
      maxLength: 2,
      words: observable.map(),
      lengths: observable.map(),
      automaticallyRepeat: true,
      delay: 2500,
      maxRepeats: 15,
      activeDictionarySize: dictionary.wordFrequency.size,
      maxDictionarySize: dictionary.wordFrequency.size,
      types: dictionary.typesToIncludeByDefault,

      get asJson() {
        return {
          minLength: this.minLength,
          maxLength: this.maxLength,
          automaticallyRepeat: this.automaticallyRepeat,
          delay: this.delay,
          maxRepeats: this.maxRepeats,
          activeDictionarySize: this.activeDictionarySize,
          types: this.types
        };
      }
    });

    this.setupActiveDictionary();
    this.setupSettings("ReadTrainer", noDebounce);

    this.loadWords = this.transport.iteratePrefix(this.WORD_PREFIX, (w, d) =>
      this.setWordData(w, d)
    );
    this.wordPersister = autorun(() => {
      for (const [k, v] of this.words.entries()) {
        this.transport.setIfDifferent(this.WORD_PREFIX + k, v);
      }
    });

    this.loadLengths = this.transport.iteratePrefix(
      this.LENGTH_PREFIX,
      (l, d) => this.setLengthData(l, d)
    );
    this.lengthPersister = autorun(() => {
      for (const [k, v] of this.lengths.entries()) {
        this.transport.setIfDifferent(this.LENGTH_PREFIX + k, v);
      }
    });
  }

  setFromJson = action(json => {
    this.setMinLength(json.minLength);
    this.setMaxLength(json.maxLength);
    // TODO: have a generic way of adding new store props that might be undefined in the JSON
    if (
      json.automaticallyRepeat !== undefined &&
      json.automaticallyRepeat !== null
    ) {
      this.setAutomaticallyRepeat(json.automaticallyRepeat);
    }

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

  setMinLength = action(l => {
    var n = parseInt(l, 10);
    if (isNaN(n) || n < 2) {
      n = 2;
    }
    this.minLength = n;
    if (this.minLength > this.maxLength) {
      this.maxLength = this.minLength;
    }
  });

  setMaxLength = action(l => {
    var n = parseInt(l, 10);
    if (isNaN(n) || n < 2) {
      n = 2;
    }
    this.maxLength = n;
    if (this.maxLength < this.minLength) {
      this.minLength = this.maxLength;
    }
  });

  setDelay = action(delay => (this.delay = parseInt(delay, 10)));

  setAutomaticallyRepeat = action(
    automaticallyRepeat => (this.automaticallyRepeat = automaticallyRepeat)
  );

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

  setWordData = action((w, data) => {
    this.words.set(w, data);
  });

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
      time: time
    });
  };

  setLengthData = action((len, data) => {
    this.lengths.set(len, data);
  });

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
      count: newCount
    });

    while (--len >= dictionary.minWordLength) {
      if (this.lengths.has(len)) {
        const { score, count } = this.lengths.get(len);
        if (newScore >= score) {
          this.setLengthData(len, {
            score: ewma(score, newScore),
            count: count + 1
          });
        }
      }
    }
  };

  textFeedback = (text, success, count, time) => {
    text.split(" ").forEach(w => this.wordFeedback(w, success, count, time));
    this.lengthFeedback(text.length, success, count);
  };

  resetLengthCount = len => {
    if (this.lengths.has(len)) {
      const { score } = this.lengths.get(len);
      this.setLengthData(len, {
        score: score,
        count: 0
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
