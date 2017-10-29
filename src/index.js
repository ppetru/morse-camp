import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import WebFontLoader from 'webfontloader';

import './index.css';
import App from './App';
import RootStore from './stores/RootStore';
import registerServiceWorker from './registerServiceWorker';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

useStrict(true);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const store = new RootStore();

ReactDOM.render((
  <div>
    <Provider store={store} audioContext={audioContext} >
      <App />
    </Provider>
  </div>
  ),
  document.getElementById('root'));

registerServiceWorker();

window.store = store;
