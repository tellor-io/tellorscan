import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['events', 'tips'],
  failure: ['error'],
  addEvent: ['event', 'tip'],
  updateTip: ['id', 'total'],
  clearAll: null
}, {prefix: "events.requests."});

export {
  Types,
  Creators
}
