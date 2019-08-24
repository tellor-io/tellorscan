import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['requests'],
  failure: ['error'],
  addRequest: ['request']
},{prefix: "newRequests."});
export {
  Types, Creators
}
