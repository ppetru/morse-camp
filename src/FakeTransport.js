class FakeTransport {
  loadSettings(module) {
    return Promise.resolve(null);
  }

  saveSettings(module, json) {}

  setIfDifferent(key, value) {}

  iterateWords(func) {}
}

export default FakeTransport;
