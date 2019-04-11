import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['requests'],
  failure: ['error'],
  addRequest: ['request'],
  addChallenge: ['challenge'],
  addNonce: ['nonce'],
  nonceUpdated: ['nonce'],
  addNewValue: ['value', 'minerOrder'],
  clearAll: null
},{prefix: "events.requests.tree."});
export {
  Types,
  Creators
}
