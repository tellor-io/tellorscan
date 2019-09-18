import {createActions} from 'reduxsauce';
const { Types,Creators} = createActions({
  initStart: null,
  initSuccess: ['votes'],
  failure: ['error'],
  addVotes: ['votes']
},{prefix: "votes."});
export {
  Types,
  Creators
}
