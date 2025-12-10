import React from "react";
import { createRoot } from "react-dom/client";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import WebFontLoader from "webfontloader";
import ReactGA from "react-ga";

import "./index.scss";
import theme from "./theme.js";
import App from "./App.jsx";
import MorsePlayer from "./MorsePlayer.js";
import RootStore from "./stores/RootStore.js";
import LocalTransport from "./LocalTransport.js";
import { registerSW } from "virtual:pwa-register";
import modernizr from "./modernizr.js";
import UnsupportedBrowser from "./UnsupportedBrowser.jsx";

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store} morsePlayer={player}>
        <App />
      </Provider>
    </ThemeProvider>
  );

  // Register service worker with update prompt
  registerSW({
    onNeedRefresh() {
      store.appStore.notifyUpdate();
    },
    onOfflineReady() {
      store.appStore.notifyCached();
    },
  });

  window.transport = transport;
  window.store = store;
  window.player = player;
} else {
  rootElement = <UnsupportedBrowser missingFeatures={missingFeatures} />;
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(rootElement);
