import React from 'react';
import ReactDOM from 'react-dom';
import DevTools from "mobx-react-devtools";
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

const store = new Model();

ReactDOM.render((
  <div>
    <DevTools />
    <App store={store} />
  </div>
  ),
  document.getElementById('root'));

registerServiceWorker();

window.store = store;
