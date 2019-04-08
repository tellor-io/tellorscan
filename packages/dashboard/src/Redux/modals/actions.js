import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  show: ['id'],
  hide: ['id'],
  collectData: ['id', 'data'],
  clearData: ['id'],
  isLoading: ['id','loading'],
  failure: ['id', 'error']
}, {prefix: "modals."});

export {
  Types,Creators
}
