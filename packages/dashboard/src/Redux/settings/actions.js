import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  clearHistoryStart: null,
  clearHistorySuccess: null,
  toggleRealtime: null,
  failure: ['error']
},{prefix: "settings."});
export {
  Types, Creators
}
