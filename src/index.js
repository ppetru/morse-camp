import React from "react";
import ReactDOM from "react-dom";
import { useStrict } from "mobx";
import { Provider } from "mobx-react";
import WebFontLoader from "webfontloader";
import { createBrowserHistory } from "history";

import "./index.css";
import App from "./App";
import MorsePlayer from "./MorsePlayer";
import RootStore from "./stores/RootStore";
import LocalTransport from "./LocalTransport";
import registerServiceWorker from "./registerServiceWorker";

WebFontLoader.load({
  google: {
    families: ["Roboto:300,400,500,700", "Material Icons"]
  }
});

useStrict(true);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const transport = new LocalTransport();
const store = new RootStore(transport);
const player = new MorsePlayer(store.morse, audioContext);
const history = createBrowserHistory();

ReactDOM.render(
  <div>
    <Provider store={store} morsePlayer={player}>
      <App history={history} />
    </Provider>
  </div>,
  document.getElementById("root")
);

registerServiceWorker(store.appStore.notifyUpdate, store.appStore.notifyCached);

window.transport = transport;
window.store = store;
window.player = player;
