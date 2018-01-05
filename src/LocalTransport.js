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
    this.setIfDifferent("/" + module, json);
  }

  setIfDifferent(key, value) {
    localforage.getItem(key).then(prevValue => {
      if (prevValue !== value) {
        localforage.setItem(key, value);
      }
    });
  }

  iterateWords(prefix, func) {
    localforage.iterate((value, key, num) => {
      if (key.startsWith(prefix)) {
        func(key.substr(prefix.length), value);
      }
    });
  }

  clear() {
    return localforage.clear();
  }
}

export default LocalTransport;
