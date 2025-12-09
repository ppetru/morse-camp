import "react-app-polyfill/stable";
import "raf/polyfill";
import React from "react";
import { createRoot } from "react-dom/client";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import WebFontLoader from "webfontloader";
import ReactGA from "react-ga";

import "./index.scss";
import App from "./App";
import MorsePlayer from "./MorsePlayer";
import RootStore from "./stores/RootStore";
import LocalTransport from "./LocalTransport";
import registerServiceWorker from "./registerServiceWorker";
import modernizr from "./modernizr";
import UnsupportedBrowser from "./UnsupportedBrowser";

ReactGA.initialize("G-65SKQ2JDP7");

WebFontLoader.load({
  google: {
    families: ["Roboto:300,400,500,700", "Material Icons"],
  },
});

configure({ enforceActions: "always" });

const requiredFeatures = {
  "Web Audio API": modernizr.webaudio,
  "Web Storage API": modernizr.localstorage,
  "CSS Flexible Box Layout": modernizr.flexbox,
};
let rootElement;
let missingFeatures = [];

for (const [name, present] of Object.entries(requiredFeatures)) {
  if (!present) {
    missingFeatures.push(name);
  }
}

if (missingFeatures.length === 0) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const transport = new LocalTransport();
  const store = new RootStore(transport);
  const player = new MorsePlayer(store.morse, audioContext);
  rootElement = (
    <Provider store={store} morsePlayer={player}>
      <App />
    </Provider>
  );

  registerServiceWorker(
    store.appStore.notifyUpdate,
    store.appStore.notifyCached,
  );

  window.transport = transport;
  window.store = store;
  window.player = player;
} else {
  rootElement = <UnsupportedBrowser missingFeatures={missingFeatures} />;
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(rootElement);
