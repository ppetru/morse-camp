import { action, autorun, extendObservable, observable } from "mobx";

import SettingsSaver from "./SettingsSaver";

// https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
const ewma = (avg, newVal, alpha = 0.1) => {
  return alpha * newVal + (1 - alpha) * avg;
};

class ReadTrainerStore extends SettingsSaver {
  WORD_PREFIX = "r-";

  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      minLength: 2,
      maxLength: 3,
      words: observable.map(),
      texts: observable.map(),

      get asJson() {
        return {
          minLength: this.minLength,
          maxLength: this.maxLength
        };
      }
    });

    this.setupSettings("ReadTrainer", noDebounce);

    this.loadWords = this.transport.iterateWords(this.WORD_PREFIX, (w, d) =>
      this.setWordData(w, d)
    );

    this.wordPersister = autorun(() => {
      for (const [k, v] of this.words.entries()) {
        this.transport.setIfDifferent(this.WORD_PREFIX + k, v);
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

  textFeedback = action((text, success, count, time) => {
    text.split(" ").forEach(w => this.wordFeedback(w, success, count, time));

    /*    if (!this.texts.has(text.length)) {
      this.texts.set(text.length, new ResultTracker(trackerSize));
    }
    this.texts.get(text.length).record(success, count);

    let maxLenScore = this.texts.get(this.maxLength);
    if (maxLenScore && maxLenScore.results.length === trackerSize) {
      if (maxLenScore.trailingRatio > 0.8) {
        this.setMaxLength(this.maxLength + 1);
      } else if (maxLenScore.trailingRatio < 0.2) {
        this.setMaxLength(this.maxLength - 1);
      }
    }

    let minLenScore = this.texts.get(this.minLength);
    if (minLenScore && minLenScore.results.length === trackerSize) {
      if (minLenScore.trailingRatio === 1) {
        this.setMinLength(this.minLength + 1);
      } else if (minLenScore.trailingRatio < 0.1) {
        this.setMinLength(this.minLength - 1);
      }
    }*/
  });
}

export default ReadTrainerStore;
