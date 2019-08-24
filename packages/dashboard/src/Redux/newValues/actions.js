import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['values'],
  addNewValues: ['values'],
  failure: ['error']
},{prefix: "newValues."});
export {
  Types,
  Creators
}
