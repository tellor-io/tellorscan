import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from 'views/home/Home';


const Routes = () => (
  <Switch>
    <Route
      path="/"
      exact
      render={() => 
        <Home />} />
  </Switch>
);

export default Routes;
