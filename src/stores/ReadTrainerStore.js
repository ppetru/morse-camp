import { action, autorun, extendObservable, observable } from "mobx";

import SettingsSaver from "./SettingsSaver";
import { minWordLength } from "../Words";

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

  lengthFeedback = action((len, success, tryCount) => {
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

    while (--len >= minWordLength) {
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
  });

  textFeedback = action((text, success, count, time) => {
    text.split(" ").forEach(w => this.wordFeedback(w, success, count, time));
    this.lengthFeedback(text.length, success, count);
  });

  resetLengthCount = action(len => {
    if (this.lengths.has(len)) {
      const { score } = this.lengths.get(len);
      this.setLengthData(len, {
        score: score,
        count: 0
      });
    }
  });

  adjustLengths = action(() => {
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
  });
}

export default ReadTrainerStore;
