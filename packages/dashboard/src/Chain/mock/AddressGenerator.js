
const NUM_BYTES = 20;
const emptyAddress = () => {
  let addr = "";
  for(let i=0;i<NUM_BYTES;++i) {
    let d = Math.floor(Math.random() * 0xFF);
    let hex = d.toString(16);
    if(hex.length < 2) {
      hex = "0" + hex;
    }
    addr += hex;
  }
  return '0x' + addr;

}
const generate = (web3) => {
  if(!web3) {
    return emptyAddress();
  }
  let acct = web3.eth.accounts.create();
  if(!acct || !acct.privateKey) {
    throw new Error("Could not generate API key");
  }
  return acct.address.toLowerCase();
}

export default generate;
