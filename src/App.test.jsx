import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "mobx-react";
import "web-audio-test-api";

import App from "./App.jsx";
import MorsePlayer from "./MorsePlayer.js";
import FakeTransport from "./FakeTransport.js";
import RootStore from "./stores/RootStore.js";

it("renders without crashing", () => {
  const transport = new FakeTransport();
  const store = new RootStore(transport);
  const audioContext = new AudioContext();
  const player = new MorsePlayer(store.morse, audioContext);
  const container = document.createElement("div");
  const root = createRoot(container);

  root.render(
    <Provider store={store} morsePlayer={player}>
      <App />
    </Provider>,
  );
});
