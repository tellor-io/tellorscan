import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './views/Home';
import Disputes from './views/Disputes';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/disputes" exact component={Disputes} />
    <Route path="*" component={Home} />
  </Switch>
);

export default Routes;
