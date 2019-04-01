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
import MainRoute from "Routes/root";
import error from "Routes/error";
import ReduxToastr from 'react-redux-toastr';

const DEF_START = "/dashboard"

class AppStart extends Component {
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

              <Route path={`/error`} component={error} />
              <Redirect to="/error" />
            </Switch>
        </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
};

export default connect(
  mapStateToProps,
  {}
)(AppStart);
