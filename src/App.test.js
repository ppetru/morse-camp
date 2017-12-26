import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import "web-audio-test-api";

import App from "./App";
import MorsePlayer from "./MorsePlayer";
import FakeTransport from "./FakeTransport";
import RootStore from "./stores/RootStore";
import "./beforeTest.js";

it("renders without crashing", () => {
  const transport = new FakeTransport();
  const store = new RootStore(transport);
  const audioContext = new AudioContext();
  const player = new MorsePlayer(store.morse, audioContext);
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store} morsePlayer={player}>
      <App />
    </Provider>,
    div
  );
});
