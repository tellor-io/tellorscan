import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import Network from './contexts/Network';
import User from './contexts/User';
import { Button } from 'antd';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
// import AlertTemplate from 'react-alert-template-basic'

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 100
  }
}

const AlertTemplate = ({ message, close }) => (
  <div className="alertBox">
    {message}
    <div className="flexer"></div>
    {/* <Button
      type="default"
      size="large"
      onClick={close}>Got it</Button> */}
  </div>
)


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
