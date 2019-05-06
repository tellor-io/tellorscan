/**
  * Just manages the instance we're going to use
  */
//import InMemory from './InMemory';
import LF from './LocalForage';

/*
let lf = new LF({
  querySizeLimit: 50
});

new InMemory({
  maxHistory: 50,
  next: lf
});
*/
new LF({
  querySizeLimit: 50
});
export default LF;
