import Miner from './Miner';
import axios from 'axios';

const NUM_MINERS = 6;
const SLEEP_BETWEEN_CHECKS = 5000;
const SLEEP_BETWEEN_MINES = 65000; //10000;

const MINER_ADDRESSES = [
                         "0xe010aC6e0248790e08F42d5F697160DEDf97E024",
                         "0xE037EC8EC9ec423826750853899394dE7F024fee",
                         "0xcdd8FA31AF8475574B8909F135d510579a8087d3",
                         "0xb9dD5AfD86547Df817DA2d0Fb89334A6F8eDd891",
                         "0x230570cD052f40E14C14a81038c6f3aa685d712B",
                         "0x3233afA02644CCd048587F8ba6e99b3C00A34DcC"
                       ];

const sleep = time => {
  return new Promise((done)=> {
    setTimeout(()=>done(), time);
  });
}

export default class TaskHandler {
  constructor(props) {
    this.chain = props.chain;
    this.miners = [];
    for(let i=0;i<NUM_MINERS;++i) {
      let m = new Miner({
        chain: this.chain,
        account: MINER_ADDRESSES[i]
      });
      this.miners.push(m);
    }
    [
      'start',
      'stop',
      '_runMiningCycle',
      '_submitNonce',
      '_getValue'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async start() {
    console.log("Mining tasker starting up");
    this.running = true;
    while(this.running) {
      let next = await this.chain.contract.getCurrentVariables();
      console.log("New challenge to be mined: ", next)
      if(next._challenge) {
        await this._runMiningCycle(next);
        console.log("Waiting for next mining cycle...");
        await sleep(SLEEP_BETWEEN_MINES);
      } else {
        await sleep(SLEEP_BETWEEN_CHECKS);
      }
    }
    console.log("Mining tasker shutting down");
  }

  async stop() {
    this.running = false;
  }

  async _runMiningCycle(next) {

    let all = [];
    let canMine = [];
    for(let i=0;i<this.miners.length;++i) {
      let m = this.miners[i];
      let stat = await this.chain.contract.getStakerInfo(m.account);
      console.log("Address, Status", m.account, stat);
      if(stat.status === 1 && canMine.length < 5) {
        canMine.push(m);
      }
    }
    if(canMine.length < 5) {
      console.log("Don't have enough mock miners to run mining cycle!");
      return;
    }

    canMine.forEach(m=>{
      all.push(m.mine({
      challenge: next._challenge,
      queryString: next._queryString,
      difficulty: next._difficulty
    }))});
    let nonces = await Promise.all(all);
    for(let i=0;i<nonces.length;++i) {
      let n = nonces[i];
      if(n > 0) {
        let value = await this._getValue(next._queryString);
        if(!isNaN(value)) {
          value = Math.ceil(value * next._granularity);
          await this._submitNonce({...next, miner: canMine[i].account, nonce: n, value});
        }
      }
    }
  }

  async _getValue(queryString) {
    let jsonField = null;
    if(queryString.startsWith("json")) {
      jsonField = queryString.substr(queryString.lastIndexOf(".")+1);
      let s = queryString.substring(queryString.indexOf("(")+1, queryString.lastIndexOf(")"));
      queryString = s;
    }
    //console.log("Will query value", queryString, jsonField);
    let r = await axios.get(queryString);
    let data = r.data;
    if(typeof data === 'string') {
      data = JSON.parse(data);
    }
    if(jsonField) {
      return data[jsonField]-0;
    }
    return data-0;
  }

  async _submitNonce(props) {
    try {
      console.log("Submitting solution", props);
      await this.chain.contract.submitMiningSolution(props.miner, ""+props.nonce, props._requestId, props.value);
      console.log("Submitted mining solution", props);
    } catch (e) {
      console.log("Failed to submit mining solution", e);
    }
  }
}
