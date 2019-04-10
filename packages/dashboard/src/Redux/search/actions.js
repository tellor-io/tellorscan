import {createActions} from 'reduxsauce';
const {Types, Creators} = createActions({
  searchStart: ['id'],
  searchSuccess: ['data'],
  failure: ['error'],
  setPageSize: ['size'],
  setSort: ['sort']
},{prefix: "search."});
export {
  Types,
  Creators
}
