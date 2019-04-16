import {createActions} from 'reduxsauce';

const {Types,Creators} = createActions({
  initStart: null,
  initSuccess: ['data'],
  update: ['data'],
  failure: ['error']
},{prefix: "tokens."});
export {
  Types,
  Creators
}
