import {createActions} from 'reduxsauce';

const {Types, Creators} = createActions({
  initStart: null,
  initSuccess: ['challenges', 'currentHash'],
  addChallenges: ['challenges', 'currentHash'],
  updateChallenges: ['challenges'],
  setCurrent: ['hash'],
  failure: ['error']
},{prefix: "challenges."});
export {
  Types,
  Creators
}
