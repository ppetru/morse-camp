import localforage from "localforage";

class LocalTransport {
  constructor() {
    localforage.config({
      name: "Morse Camp"
    });
  }

  loadCopyTrainer() {
    return localforage.getItem("copyTrainer");
  }

  saveCopyTrainer(json) {
    localforage.setItem("copyTrainer", json);
  }

  loadMorse() {
    return localforage.getItem("morsePlayer");
  }

  saveMorse(json) {
    localforage.setItem("morsePlayer", json);
  }
}

export default LocalTransport;
