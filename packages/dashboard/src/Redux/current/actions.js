import {createActions} from 'reduxsauce';

const {Types,Creators} = createActions({
  loadRequest: null,
  loadSuccess: ['data', 'slots'],
  failure: ['error'],
  update: ['data'],
  slotMined: ['data']
},{prefix: "current."});

export {
  Types,
  Creators
}
