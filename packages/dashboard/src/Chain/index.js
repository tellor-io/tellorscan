/*
 * Just manages how we are going to access chain data
 */

 import Web3Wrapper from './web3/Web3Wrapper';
 //import Mock from './mock/Mock';

 let inst = null;
 export const init = (props) => {
   if(!inst) {
     //inst = new Mock(props);
     inst = new Web3Wrapper();
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
