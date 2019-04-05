import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Route, Switch, Redirect } from 'react-router-dom';

//by default, go to main dashboard
const DEF_ROUTE = "/dashboard/main";

function Loading({ error }) {
  if (error) {
    return 'Something went wrong: ' + (error.message?error.message:error);
  } else {
    return <h3>Loading...</h3>;
  }
}

const Main = Loadable({
  loader: () => import('Views/dashboard'),
  loading: Loading
});

class App extends Component {
  render() {
    const { location,match } = this.props;
    if(location.pathname === '/dashboard') {
      //redirect to main dashboard if nothing specified in url
      return (<Redirect to={DEF_ROUTE} />)
    }

    return (
      <div className="app-container container-fluid mr-0 ml-0 pr-0 pl-0">
            <Switch>
              <Route path={`${match.url}/main`} component={Main} />
              <Redirect to="/error" />
            </Switch>
      </div>
    );
  }
}

export default App;
