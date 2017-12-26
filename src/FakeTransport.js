class FakeTransport {
  constructor() {
    this.store = new Map();
  }

  loadSettings(module) {
    return Promise.resolve(this.store.get("/" + module));
  }

  saveSettings(module, json) {
    this.setIfDifferent("/" + module, json);
  }

  setIfDifferent(key, value) {
    this.store.set(key, value);
  }

  iterateWords(func) {
    this.store.forEach((value, key) => {
      if (key[0] !== "/") {
        func(key, value);
      }
    });
  }
}

export default FakeTransport;
