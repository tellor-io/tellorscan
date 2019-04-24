import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['data'],
  failure: ['error'],
  addRequest: ['data'],
  updateRequest: ['data'],
  updateCurrent: ['data']
},{prefix: "requests."});
export {
  Types, Creators
}
