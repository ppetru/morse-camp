import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import WebFontLoader from 'webfontloader';

import './index.css';
import App from './App';
import Model from './Model';
import registerServiceWorker from './registerServiceWorker';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

useStrict(true);

const store = new Model();
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

ReactDOM.render((
  <div>
    <DevTools />
    <Provider store={store} audioContext={audioContext} >
      <App />
    </Provider>
  </div>
  ),
  document.getElementById('root'));

registerServiceWorker();

window.store = store;
