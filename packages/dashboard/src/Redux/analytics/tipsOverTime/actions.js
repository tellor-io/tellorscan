import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['data'],
  failure: ['error'],
  update: ['event']
}, {prefix: "analytics.tipsOverTime."});
export {
  Types,
  Creators
}
