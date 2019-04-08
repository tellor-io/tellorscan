import {createActions} from 'reduxsauce';

const {
  Types,
  Creators
} = createActions({
  initStart: null,
  initSuccess: ['top', 'counts'],
  failure: ['error'],
  updateStart: null,
  updateSuccess: ['event']
}, {prefix: "analytics.topAPI."});

export {
  Types,
  Creators
}
