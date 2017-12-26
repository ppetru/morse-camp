import { action, autorun, extendObservable, observable } from "mobx";

import SettingsSaver from "./SettingsSaver";

class CopyTrainerStore extends SettingsSaver {
  constructor(rootStore, transport, noDebounce) {
    super();
    this.rootStore = rootStore;
    this.transport = transport;

    extendObservable(this, {
      minLength: 2,
      maxLength: 3,
      words: observable.map(),

      get asJson() {
        return {
          minLength: this.minLength,
          maxLength: this.maxLength
        };
      }
    });

    this.setupSettings("copyTrainer", noDebounce);

    this.loadWords = this.transport.iterateWords((w, d) =>
      this.setWordData(w, d)
    );

    this.wordPersister = autorun(() => {
      for (const [k, v] of this.words.entries()) {
        this.transport.setIfDifferent(k, v);
      }
    });
  }

  setFromJson = action(json => {
    this.setMinLength(json.minLength);
    this.setMaxLength(json.maxLength);
  });

  setWordData = action((w, data) => {
    this.words.set(w, data);
  });

  setMinLength = action(l => {
    var n = parseInt(l, 10);
    if (isNaN(n)) {
      n = 0;
    }
    this.minLength = n;
    if (this.minLength > this.maxLength) {
      this.maxLength = this.minLength;
    }
  });

  setMaxLength = action(l => {
    var n = parseInt(l, 10);
    if (isNaN(n)) {
      n = 0;
    }
    this.maxLength = n;
    if (this.maxLength < this.minLength) {
      this.minLength = this.maxLength;
    }
  });

  wordFeedback = action((word, success, count, time) => {
    this.setWordData(word, {
      s: success / count,
      t: time
    });
  });

  textFeedback = action((text, success, count, time) => {
    const words = text.split(" ");
    words.forEach(w => this.wordFeedback(w, success, count, time));
  });
}

export default CopyTrainerStore;
