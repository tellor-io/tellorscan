import Miner from './Miner';
import axios from 'axios';

const NUM_MINERS = 6;
const SLEEP_BETWEEN_CHECKS = 15000;
//const SLEEP_BETWEEN_MINES = 65000; //10000;

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
    setTimeout(done, time);
  });
}

export default class TaskHandler {
  constructor(props) {
    this.chain = props.chain;
    this.miners = [];
    this.initRequired = props.initRequired;
    this.miningSleepTime = props.miningSleepTime;
    this.queryString = props.queryString;
    this.queryRate = props.queryRate;
    this.lastQuery = 0;

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
      '_getValue',
      '_requestData'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async start() {
    console.log("Mining tasker starting up");
    this.running = true;
    if(this.initRequired) {
      await this.chain.contract.tellorPostConstructor(MINER_ADDRESSES[0]);
      console.log("Contract initialized");
    }
    while(this.running) {
      try {
        let next = await this.chain.contract.getCurrentVariables();

        if(next._challenge) {
          console.log("New challenge to be mined: ", next)
          await this._runMiningCycle(next);
          console.log("Waiting",this.miningSleepTime,"ms for next mining cycle...");
          await sleep(this.miningSleepTime);
        } else {
          if(this.queryRate) {
            let diff = Date.now() - this.lastQuery;
            if(diff > this.queryRate) {
              await this._requestData();
            }
          }
          console.log("Waiting to check for new tasking...");
          await sleep(SLEEP_BETWEEN_CHECKS);
        }
      } catch (e) {
        console.log("Problem in task run loop", e);
      }
    }
    console.log("Mining tasker shutting down");
  }

  async _requestData() {
    try {
      console.log("Requesting data...");
      let con = this.chain.contract;
      await con.requestData(MINER_ADDRESSES[0], this.queryString, "BTC/USD", 1000, 0);
      this.lastQuery= Date.now();
    } catch (e) {
      console.log("Problem requesting data", e);
    }
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
    let jsonFields = null;
    if(queryString.startsWith("json") || queryString.startsWith("xjson")) {
      let fields = queryString.substr(queryString.lastIndexOf(")")+1);
      let s = queryString.substring(queryString.indexOf("(")+1, queryString.lastIndexOf(")"));
      queryString = s;
      jsonFields = fields.split(".");
    }
    //console.log("Will query value", queryString, jsonField);
    let r = null;
    try {
      r = await axios.get(queryString);
    } catch (e) {
      console.log("Problem with query string", queryString, e);
      return 0;
    }

    let data = r.data;
    if(typeof data === 'string') {
      data = JSON.parse(data);
    }
    if(!data) {
      return 0;
    }

    if(jsonFields) {
      let finalVal = null;
      let d = data;
      for(let i=0;i<jsonFields.length;++i) {
        let f = jsonFields[i];
        if(f.trim().length > 0) {
          d = d[f];
          if(!d) {
            return 0;
          }
        }
      }
      return d-0;
    }
    if(isNaN(data)) {
      if(data.price) {
        return data.price - 0;
      }
      return 0;
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
