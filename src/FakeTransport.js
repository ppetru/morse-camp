class FakeTransport {
  loadCopyTrainer() {
    return Promise.resolve(null);
  }

  saveCopyTrainer(json) {
  }

  loadMorse() {
    return Promise.resolve(null);
  }

  saveMorse(json) {
  }
}

export default FakeTransport;
