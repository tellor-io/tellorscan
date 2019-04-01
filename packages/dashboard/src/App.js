import React from 'react';

import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import App from 'Views';
import ScrollToTop from 'Components/Scroll/ScrollToTop';
import configureStore from 'Store/configureStore';

const MainApp = () => (<Provider store={configureStore()}>
  <Router>
    <ScrollToTop>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </ScrollToTop>
  </Router>
</Provider>);

export default MainApp;
