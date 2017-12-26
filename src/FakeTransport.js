class FakeTransport {
  loadSettings(module) {
    return Promise.resolve(null);
  }

  saveSettings(module, json) {
  }
}

export default FakeTransport;
