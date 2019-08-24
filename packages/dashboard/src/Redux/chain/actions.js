import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  loadRequest: null,
  loadSuccess: ['chain', 'pipeline', 'ethHistory'],
  failure: ['error']
},{prefix: "chain."});
export {
  Types,
  Creators
}
