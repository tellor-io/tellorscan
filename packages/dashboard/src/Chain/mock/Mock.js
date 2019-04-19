import EventEmitter from 'events';
import Simulator from './simulation/Simulator';
import AddressGenerator from './AddressGenerator';
import MockContract from './MockContract';
import Web3 from 'web3';
import * as ethUtils from 'web3-utils';
import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

/*
 * We want to simulate this scenario:
 * 1) User submits a data request with tip amount
 * 2) miners act on the query by submitting nonce's after 5-10 seconds
 * 3) Once 5 mined, winning price should get selected and a NewValue is announced
 *
 * User can increment tip during operation so we need to account
 * for that.
 */

 const updateLastBlock = async (block, time) => {
   Storage.instance.create({
     database: dbNames.Blocks,
     key: ethUtils.sha3(JSON.stringify({block,time})),
     data: {
       number: block,
       timestamp: time
     }
   });
 }

const MAX_HISTORY = 100;
export default class Mock extends EventEmitter {
  constructor(props) {
    super(props);
    this.block = 0;
    this.blockTimes = [];

    let ethProvider = window.ethereum;
    if(!ethProvider && window.web3){
      ethProvider =  window.web.currentProvider;
    }
    if(ethProvider) {
      this.web3 = new Web3(ethProvider);
    }
    this.contract = new MockContract({
      chain: this
    });
    this.simulator = new Simulator({
      chain: this
    });

    this.userAddress = AddressGenerator(this.web3);
    this.events = {};
    this.requestQueue = [];
    [
      'init',
      'unload',
      'getBlock',
      'latestBlock',
      'getPastEvents',
      'getMissingBlockRanges',
      'publishEvent',
      'getContract',
      'incrementBlock'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async getMissingBlockRanges() {
    return []
  }

  async init() {
    //we need to make sure we have the proper block number
    let r = await Storage.instance.readAll({
      database: dbNames.Blocks,
      limit: 50,
      sort: [{
        field: "number",
        order: 'desc'
      }]
    });
    let blocks = r || [];
    this.blockTimes = blocks.reduce((o, b)=>{
      o[b.number] = b;
      return o;
    },{});
    this.blockTimes['latest'] = blocks[0];//descending order
    let b = blocks[0] || {};
    this.block = b.number || 0;
    this.ethereumAccount = "0x123456789...";
    await this.contract.init();
  }

  async unload() {

  }

  async getBlock(number) {
    let time = this.blockTimes['latest'];

    //the only reason this is being called is to get a damn timestamp
    //for the block.
    if(!time) {
      //unknown block
      throw new Error("Attempting to get unknown block: " + number);
    }
    return {
      number,
      timestamp: time
    }
  }

  getContract() {
    return this.contract;
  }

  async incrementBlock()  {
    let now = Math.floor(Date.now()/1000);

    this.block++;
    this.blockTimes = {
      ...this.blockTimes,
      [this.block]: now,
      latest: now
    };

    await updateLastBlock(this.block, now);
  }

  async latestBlock() {
    return this.block;
  }

  async getPastEvents(event, opts, callback) {
    let fromBlock = opts.fromBlock || 0;
    let toBlock = opts.toBlock || "latest";
    if(!callback) {
      callback = () => {}
    }

    let list = this.events[event] || [];
    let filter = opts?opts.filter:{};
    if(!filter) {
      filter = {};
    }
    let filtered = list.filter(e=>{
      if(e.blockNumber<fromBlock) {
        return false;
      }
      if(toBlock !== 'latest') {
        if(e.blockNumber > toBlock) {
          return false;
        }
      }

      let filterKeys = _.keys(filter);
      for(let i=0;i<filterKeys.length;++i) {
        let prop = filterKeys[i];
        let tgtVal = filter[prop];
        let val = e[prop];
        if(!val) {
          return false;
        }
        if(Array.isArray(tgtVal)) {
          for(let j=0;j<tgtVal.length;++j) {
            let aVal = tgtVal[j];
            if(aVal !== val) {
              return false;
            }
          }
        } else if(tgtVal !== val) {
          return false;
        }
      }
      return true;
    });
    callback(null, filtered);
    return filtered;
  }

  async publishEvent(event) {
    if(!isNaN(event.blockNumber)) {
      let b4 = this.block;
      this.block = Math.max(event.blockNumber, this.block);
      if(b4 !== this.block) {
        let now = Math.floor(Date.now()/1000);
        await updateLastBlock(this.block, now);
      }
    }

    let fromMem = this.events[event.event] || [];
    let list = [
      event, //newest at front of list
      ...fromMem
    ];
    //truncate oldest data
    list.length = Math.min(list.length, MAX_HISTORY);
    let events = {
      ...this.events,
      [event.event]: list
    };
    this.events = events;
    return this.emit(event.event || event.name, event);
  }
}
