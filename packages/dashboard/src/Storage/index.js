/**
  * Just manages the instance we're going to use
  */
import InMemory from './InMemory';
//import PouchDB from './PouchDB';

new InMemory({
  maxHistory: 50
});
export default InMemory;
