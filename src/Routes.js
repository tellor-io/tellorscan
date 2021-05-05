import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import Voting from 'views/voting/Voting';
// import Migrate from 'views/migrate/Migrate';

import Dashboard from 'views/dashboard/Dashboard';
import Detail from 'views/detail/Detail';


const Routes = ({ events, prices }) => (
  <Switch>
    <Route path="/" exact render={() => <Dashboard events={events} prices={prices} />} />
    <Route path="/detail/:priceId" exact render={() => <Detail events={events} prices={prices} />} />
    <Route path="*" component={Dashboard} />

    {/* <Route path="/voting" exact component={Voting} />
    <Route path="/migrate" exact component={Migrate} /> */}

  </Switch>
);

export default Routes;
