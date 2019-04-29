import {createActions} from 'reduxsauce';
const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['data'],
  failure: ['error'],
  update: ['data']
},{prefix: "mining."});
export {
  Types,
  Creators
}
