import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['nonces'],
  addNonces: ['nonces'],
  failure: ['error']
},{prefix: "nonces."});
export {
  Types,
  Creators
}
