import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import Network from './contexts/Network';
import User from './contexts/User';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '10px',
  transition: transitions.SCALE
}

import './style/index.scss';

ReactDOM.render(
    <Network>
      <User>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </User>
    </Network>,
  document.getElementById('root'),
);

serviceWorker.unregister();
