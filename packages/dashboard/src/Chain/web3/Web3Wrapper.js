import Web3 from 'web3';
import {
  DEFAULT_MASTER_CONTRACT,
  DEFAULT_TELLOR_CONTRACT
} from 'Constants/chain/web3Config';
import abi from 'Chain/abi';
import Web3Contract from './Web3Contract';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

export default class Web3Wrapper {
  constructor(props) {
    this.times = {};

    [
      'init',
      'unload',
      'getBlock',
      'latestBlock',
      'getContract',
      'getTime',
      'getMissingBlockRanges',
      '_storeBlockTime'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async init() {
    if(this.contract) {
      await this.contract.init();
      return;
    }

    let ethProvider = window.ethereum;
    if(!ethProvider && window.web3){
      ethProvider =  window.web.currentProvider;
    }
    if(ethProvider) {
      this.web3 = new Web3(ethProvider);
      let acts = await ethProvider.enable();
      if(!acts) {
        //user denied access to app
        acts = [];
      }
      this.block = await this.web3.eth.getBlockNumber();

      await this.web3.eth.clearSubscriptions()
      let em = this.web3.eth.subscribe('newBlockHeaders');
      em.on("data", async (block)=>{

        if(block) {
          this.block = block.number;
          this.times[this.block] = block.timestamp;
          //TODO: cleanup times if the client will run for a long time!
          await this._storeBlockTime(this.block);
        }
      });

      let master = new this.web3.eth.Contract(abi, DEFAULT_MASTER_CONTRACT, {
        address: DEFAULT_MASTER_CONTRACT
      });
      let tellor = new this.web3.eth.Contract(abi, DEFAULT_TELLOR_CONTRACT, {
        address: DEFAULT_TELLOR_CONTRACT
      });
      this.contract = new Web3Contract({chain: this, master, tellor, caller: acts[0]});
      this.ethereumAccount = acts[0];
      await this.contract.init();
    }
  }

  async unload() {
    localStorage.setItem("web3Wrapper.unload", true);
    await this.contract.unload();
  }

  async getTime(block) {
    let t = this.times[block];
    if(t) {
      return t;
    }
    let b = await this.web3.eth.getBlock(block);
    if(b) {
      this.times[b.number] = b.timestamp;
      await this._storeBlockTime(b);
      return b.timestamp;
    }
    return undefined;
  }

  getBlock(number) {
    return this.web3.getBlock(number);
  }

  async latestBlock() {
    return this.block;
  }

  getContract(props) {
    return this.contract;
  }

  async getMissingBlockRanges(limit) {
    let all = await Storage.instance.readAll({
      database: dbNames.Blocks,
      limit,
      sort: [
        {
          field: "blockNumber",
          order: "desc"
        }
      ]
    });
    let gaps = [];
    let last = all[0]?all[0].blockNumber-0:0;
    //the first gap could be from the latest block back
    if(last < this.block) {
      gaps.push({
        start: last,
        end: this.block
      });
    }

    all.forEach(a=>{
      //if current block is earlier than one less than last
      //there is a gap
      if(a.blockNumber-0 < (last-1)) {
        gaps.push({
          //gap starts with the current block
          start: a.blockNumber-0,
          //going forward in ascending order to last one seen
          end: last
        });
      }
      last = a.blockNumber-0;
    });

    //we need to reverse sort the gaps because they are currently
    //in descending order. They need to be in increasing order
    gaps.sort((a,b)=>{
      return a.start - b.start;
    })
    return gaps;
  }

  async _getLastSeenBlock() {
    let r = await Storage.instance.readAll({
      database: dbNames.Blocks,
      limit: 1,
      sort: [
        {
          field: "blockNumber",
          order: "desc"
        }
      ]
    });
    let b = r[0];
    return b?b.blockNumber:0;
  }

  async _storeBlockTime(block) {
    if(!block) {
      return;
    }
    await Storage.instance.create({
      database: dbNames.Blocks,
      key: ""+block.number,
      data: {
        blockNumber: block.number,
        timestamp: block.timestamp
      }
    });
  }
}
