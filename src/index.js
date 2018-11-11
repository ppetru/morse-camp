import "babel-polyfill";
import "raf/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { useStrict } from "mobx";
import { Provider } from "mobx-react";
import WebFontLoader from "webfontloader";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";

import "./index.scss";
import App from "./App";
import MorsePlayer from "./MorsePlayer";
import RootStore from "./stores/RootStore";
import LocalTransport from "./LocalTransport";
import registerServiceWorker from "./registerServiceWorker";
import modernizr from "./modernizr";
import UnsupportedBrowser from "./UnsupportedBrowser";

ReactGA.initialize("UA-111651933-2");

WebFontLoader.load({
  google: {
    families: ["Roboto:300,400,500,700", "Material Icons"]
  }
});

useStrict(true);

const requiredFeatures = {
  "Web Audio API": modernizr.webaudio,
  "Web Storage API": modernizr.localstorage,
  "CSS Flexible Box Layout": modernizr.flexbox
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
  const history = createBrowserHistory();
  rootElement = (
    <Provider store={store} morsePlayer={player}>
      <App history={history} />
    </Provider>
  );

  registerServiceWorker(
    store.appStore.notifyUpdate,
    store.appStore.notifyCached
  );

  window.transport = transport;
  window.store = store;
  window.player = player;
} else {
  rootElement = <UnsupportedBrowser missingFeatures={missingFeatures} />;
}

ReactDOM.render(rootElement, document.getElementById("root"));
