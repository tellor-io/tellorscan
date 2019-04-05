import {createActions} from 'reduxsauce';

const { Types, Creators } = createActions({
  loadRequest: null,
  loadSuccess: ['data'],
  failure: ['error'],
  addEvent: ['data'],
  selectQuery: ['query']
}, {prefix: "queries."});

export {
  Types,
  Creators
}
