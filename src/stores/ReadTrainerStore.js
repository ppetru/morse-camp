import { action, autorun, extendObservable, observable } from "mobx";

import SettingsSaver from "./SettingsSaver";

// https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
const ewma = (avg, newVal, alpha = 0.1) => {
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
      maxLength: 3,
      words: observable.map(),
      lengths: observable.map(),

      get asJson() {
        return {
          minLength: this.minLength,
          maxLength: this.maxLength
        };
      }
    });

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
  });

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

  setWordData = action((w, data) => {
    this.words.set(w, data);
  });

  wordFeedback = action((word, success, count, time) => {
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
  });

  setLengthData = action((len, data) => {
    this.lengths.set(len, data);
  });

  lengthFeedback = action((len, success, count) => {
    let avgScore;
    let score = success / count;

    if (this.lengths.has(len)) {
      avgScore = ewma(this.lengths.get(len).score, score);
    } else {
      avgScore = score;
    }

    this.setLengthData(len, {
      score: avgScore
    });
  });

  textFeedback = action((text, success, count, time) => {
    text.split(" ").forEach(w => this.wordFeedback(w, success, count, time));
    this.lengthFeedback(text.length, success, count);
  });
}

export default ReadTrainerStore;
