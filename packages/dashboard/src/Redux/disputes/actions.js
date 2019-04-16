import {createActions} from 'reduxsauce';
const { Types,Creators} = createActions({
  initStart: null,
  initSuccess: ['data'],
  failure: ['error'],
  update: ['data'],
  selectForDispute: ['challenge', 'nonce']
},{prefix: "disputes."});
export {
  Types,
  Creators
}
