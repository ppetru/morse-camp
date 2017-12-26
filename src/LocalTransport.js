import localforage from "localforage";

class LocalTransport {
  constructor() {
    localforage.config({
      name: "Morse Camp"
    });
  }

  loadMorse() {
    return localforage.getItem("morsePlayer");
  }

  saveMorse(json) {
    localforage.setItem("morsePlayer", json);
  }
}

export default LocalTransport;
