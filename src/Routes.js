import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Mining from 'views/mining/Mining';
import Voting from 'views/voting/Voting';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Mining} />
    <Route path="/voting" exact component={Voting} />
    <Route path="/mining" exact component={Mining} />
    <Route path="*" component={Mining} />
  </Switch>
);

export default Routes;
