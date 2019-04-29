// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import 'scss/style.scss'

import "react-table/react-table.css";

import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route,Switch } from "react-router-dom";
import MainRoute from "Routes/dashboard";
import Details from 'Routes/details';
import Settings from 'Routes/settings';
import Disputes from 'Routes/disputes';
import Miner from 'Routes/miner';

import error from "Routes/error";
import ReduxToastr from 'react-redux-toastr';
import {default as initOps} from 'Redux/init/operations';

const DEF_START = "/dashboard"

class AppStart extends Component {
  componentWillMount() {
    if(this.props.needsInit) {
      this.props.callInit();
    }
  }

  render() {
    const { location, match } = this.props;
    if (location.pathname === '/') {
      return (<Redirect to={DEF_START} />);
    }

    return (
      <Fragment>
        <ReduxToastr
          timeOut={5000}
          newestOnTop={true}
          preventDuplicates
          position="top-right"
          transitionIn="bounceIn"
          transitionOut="bounceOut"
          progressBar/>

            <Switch>
              <Route path={`${match.url}dashboard`} component={MainRoute} />
              <Route path={`${match.url}details`} component={Details} />
              <Route path={`${match.url}settings`} component={Settings} />
              <Route path={`${match.url}disputes`} component={Disputes} />
              <Route path={`${match.url}miner`} component={Miner} />
              <Route path={`/error`} component={error} />
              <Redirect to="/error" />
            </Switch>
        </Fragment>
    );
  }
}

const s2p = state => {
  return {
    needsInit: !state.init.initComplete && !state.init.initStarted
  }
}

const d2p = dispatch => {
  return {
    callInit: () => dispatch(initOps.start())
  }
}

export default connect(s2p, d2p)(AppStart);
