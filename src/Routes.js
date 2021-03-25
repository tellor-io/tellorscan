import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Voting from 'views/voting/Voting';
import Migrate from 'views/migrate/Migrate';

import Dashboard from 'views/dashboard/Dashboard';


const Routes = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/voting" exact component={Voting} />
    {/* <Route path="/mining" exact component={Mining} /> */}
    {/* <Route path="/prices" exact component={Prices} /> */}
    <Route path="/migrate" exact component={Migrate} />
    <Route path="*" component={Dashboard} />
  </Switch>
);

export default Routes;
