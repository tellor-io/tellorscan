import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import * as serviceWorker from './serviceWorker';

import App from './App';
import Store from './contexts/Store';

import './style/index.scss';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/skuhlmann/tellor-playground',
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Store>
      <App />
    </Store>
  </ApolloProvider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
