import localforage from "localforage";

class LocalTransport {
  constructor() {
    localforage.config({
      name: "Morse Camp"
    });
  }

  loadSettings(module) {
    return localforage.getItem("/" + module);
  }

  saveSettings(module, json) {
    localforage.setItem("/" + module, json);
  }
}

export default LocalTransport;
