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

  iteratePrefix(prefix, func) {
    this.store.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        func(key.substr(prefix.length), value);
      }
    });
  }
}

export default FakeTransport;
