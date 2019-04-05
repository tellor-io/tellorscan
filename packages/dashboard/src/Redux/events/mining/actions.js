import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['nonces', 'values'],
  failure: ['error'],
  addEvent: ['event']
}, {prefix: "events.mining."});

export {
  Types,
  Creators
}
