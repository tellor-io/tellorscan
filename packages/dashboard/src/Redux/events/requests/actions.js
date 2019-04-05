import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['events'],
  failure: ['error'],
  addEvent: ['event']
}, {prefix: "events.requests."});

export {
  Types,
  Creators
}
