import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  selectForTip: ['request']
},{prefix: "tips."});
export {
  Types,
  Creators
}
