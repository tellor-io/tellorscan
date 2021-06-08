import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Migrate from 'views/migrate/Migrate';
import Dashboard from 'views/dashboard/Dashboard';
import Detail from 'views/detail/Detail';


const Routes = ({ events, prices,disputes, activeDisputesCount,disputesReady }) => (
  <Switch>
    <Route
      path="/"
      exact
      render={() => 
        <Dashboard
          events={events}
          prices={prices}
          disputes={disputes}
          activeDisputesCount={activeDisputesCount}
          disputesReady={disputesReady}
          />} />
    <Route
      path="/detail/:priceId"
      exact
      render={() =>
        <Detail
          events={events}
          prices={prices} />} />
    {/* <Route path="*" component={Dashboard} /> */}
    <Route path="/migrate" exact component={Migrate} /> 


  </Switch>
);

export default Routes;
