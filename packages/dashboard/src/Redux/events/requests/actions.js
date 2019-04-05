import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['events'],
  failure: ['error'],
  addEvent: ['event'],
  updateTip: ['id', 'total']
}, {prefix: "events.requests."});

export {
  Types,
  Creators
}
