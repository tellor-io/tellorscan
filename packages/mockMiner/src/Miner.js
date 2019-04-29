import * as yup from 'yup';
import abi from 'ethereumjs-abi';
import util from 'ethereumjs-util';

import * as web3Utils from 'web3-utils';
//var RIPEMD160 = require('ripemd160')

const propsSchema = yup.object().shape({
  account: yup.string().required("Missing account")
});

const randint = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const generate_random_number = () => {
    return randint(1000000,9999999)
}

const trim0x = s => {
  if(s.startsWith('0x')) {
    return s.substr(2);
  }
  return s;
}

export default class Miner {
  constructor(props) {
    propsSchema.validateSync(props);
    this.account = props.account;
    this.chain = props.chain;
    if(!this.chain) {
      throw new Error("Missing chain in props");
    }

    [
      'mine'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async mine({challenge, queryString, difficulty}) {
    let last_block = await this.chain.getBlockNumber();
    let x = 0;
  	while(true) {
  		x += 1;
  		let j = generate_random_number()
      let jEnc = Buffer.from(""+j);
      let nonce = jEnc.toString("hex")//ethUtils.toHex(jEnc.toString(""));
      let preHashStr = challenge + trim0x(this.account) + trim0x(nonce);
      let hashHexStr = util.sha3(preHashStr);
      let rmdOut = util.ripemd160(hashHexStr);
      let num = new util.BN(util.sha256(rmdOut));
      let diffBN = new util.BN(""+difficulty);

      if((num.mod(diffBN).toString()-0) === 0) {
        return j;
      }

  		if(x % 10000 === 0) {
        let _block = await this.chain.getBlockNumber();
        if(last_block != _block) {
          let {_challenge,_requestId,_difficulty,_queryString} = await this.chain.contract.getCurrentVariables();
  				if(challenge !== _challenge) {
            return 0;
          }
        }
      }
    }
  }

}
