import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import rootReducer from 'Redux/reducers'
import DepMiddleware from 'Redux/DepMiddleware';

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
      applyMiddleware(
        thunk,
        DepMiddleware(),
        createLogger())
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('Redux/reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
}

export default configureStore
