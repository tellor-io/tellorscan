import React from 'react';

import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import App from 'Views';
import ScrollToTop from 'Components/Scroll/ScrollToTop';
import configureStore from 'Store/configureStore';
import {default as initOps} from 'Redux/init/operations';

let store = configureStore();
window.addEventListener("beforeunload", (e)=>{
  /**
   * NOTE: this is a best-attempt to cleanup chain subscriptions.
   * It is NOT guaranteed to run since the browser may kill the
   * thread before the async function completes. A waste-time
   * example loop is given but even that wouldn't guarantee execution
   * since it interrupts the main UI thread that is also calling the
   * dispatch function in JavaScript's single event loop.
   */
  let done = [false];
  e.preventDefault();
  store.dispatch(initOps.unload()).then(()=>{
    e.returnValue="finished";
    done[0] = true;
    return "finished";
  }).catch(e=>{
    done[0] = true;
    e.returnValue = e.message;
    return e.message;
  });

  /**
   * This doesn't work. For some reason the unsubscribe function in
   * web3.eth never returns to closeout the final promise. 

  let now = Date.now();
  let max = now + 5000;
  while(!done[0] && now < max) {
    now = Date.now();
  }
  */
});

const MainApp = () => (<Provider store={store}>
  <Router>
    <ScrollToTop>
      <Switch>
        <Route path="/" component={App}/>
      </Switch>
    </ScrollToTop>
  </Router>
</Provider>);

export default MainApp;
