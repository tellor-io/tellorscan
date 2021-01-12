import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import Store from './contexts/Store';

import './style/index.scss';


ReactDOM.render(
  <Store>
    <App />
  </Store>,
  document.getElementById('root'),
);

serviceWorker.unregister();
