class FakeTransport {
  loadMorse() {
    return Promise.resolve(null);
  }

  saveMorse(json) {
  }
}

export default FakeTransport;
