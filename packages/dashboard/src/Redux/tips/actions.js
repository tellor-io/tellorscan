import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['tips'],
  failure: ['error'],
  update: ['id','tip']
},{prefix: "tips."});
export {
  Types,
  Creators
}
