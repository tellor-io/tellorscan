import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from 'Redux/reducers'
import DepMiddleware from 'Redux/DepMiddleware';


const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(
        thunk,
        DepMiddleware())
    )
  )

  return store
}

export default configureStore
