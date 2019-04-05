/*
 * Just manages how we are going to access chain data
 */

 //import Web3 from './Web3';
 import Mock from './mock/Mock';

 let inst = null;
 export const init = (props) => {
   if(!inst) {
     inst = new Mock(props);
   }
   return inst;
 }

 const instance = () => {
   if(!inst) {
     throw new Error("Must first initialize chain");
   }
   return inst;
 }

 export default instance;
