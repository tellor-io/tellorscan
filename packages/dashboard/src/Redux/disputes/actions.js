import {createActions} from 'reduxsauce';
const { Types,Creators} = createActions({
  initStart: null,
  initSuccess: ['disputes'],
  failure: ['error'],
  addDisputes: ['disputes'],
  update: ['dispute'],
  selectForDispute: ['challenge', 'nonce']
},{prefix: "disputes."});
export {
  Types,
  Creators
}
