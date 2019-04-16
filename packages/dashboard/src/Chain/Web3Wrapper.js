import Web3 from 'web3';
import {
  DEFAULT_MASTER_CONTRACT,
  DEFAULT_TELLOR_CONTRACT
} from 'Constants/chain/web3Config';
import abi from 'Chain/abi';
import SubscriptionProvider from './SubscriptionProvider';
import EventEmitter from 'events';
import eventFactory from 'Chain/LogEvents/EventFactory';

class ConAPI {
  constructor({chain, master, tellor, caller}) {
    this.chain = chain;
    this.master = master;
    this.caller = caller;
    this.tellor = tellor;
    this.eventHistory = {};
    this._emitter = new EventEmitter();

    /*
     * So here's the deal. Because contracts are broken out into libs,
     * master, and tellor, the events would not be coming from any single
     * one of these contracts. So, we need to listen to all of them and
     * create a single notification mechanism so that the app is isolated
     * from all this complexity.
     */
    this.events = new SubscriptionProvider({
      chain: this._emitter //pretend our emitter is the blockchain
    });

    this.eventSubs = {};

    this.sub = this.master.events.allEvents(null, (e, evt)=>{
      if(evt) {
        console.log("Getting event from MASTER", evt);
        let outEvent = eventFactory(evt);
        if(outEvent) {
          this._emitter.emit(outEvent.name, outEvent);
        }
      }
    });

    [
      'init',
      'unload',
      'requestData',
      'addTip',
      'getVariables',
      'getVariablesOnQ',
      'getApiVars',
      'getApiId',
      '_call',
      '_send'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  _call(con, method, args) {
    return con.methods[method](...args).call({
      from: this.caller,
      gas: 100000
    });
  }

  _send(con, method, args) {
    let tx = con.methods[method](...args);
    return new Promise((done,err)=>{
      this.chain.web3.eth.sendTransaction({
        to: con.address,
        from: this.caller,
        data: tx.encodeABI()
      }, (e,r)=>{
        if(e) {
          err(e);
        } else {
          done(r);
        }
      });
    });
  }

  async init() {
    //could we pull current stuff from contract and cache it here?
  }

  async unload() {
    if(this.sub) {
      await this.sub.unsubscribe();
      this.sub = null;
    }
  }

  getVariables() {
      return this._call(this.master, "getVariables", []);
  }

  getApiVars(_apiId) {
    return this._call(this.master, "getApiVars", [_apiId]);
  }

  getApiId(hash) {
    return this._call(this.master, "getApiId", [hash]);
  }


  getVariablesOnQ() {
    return this._call(this.master, "getVariablesOnQ", []);
  }


  requestData(queryString, symbol, requestId, multiplier, tip) {
    return this._send(this.master, "requestData", [queryString, symbol, requestId, multiplier, tip]);
  }

  addTip(requestId, tip) {
    return this._send(this.master, "addTip", [requestId, tip]);
  }
}

export default class Web3Wrapper {
  constructor(props) {
    this.times = {};

    [
      'init',
      'unload',
      'getBlock',
      'latestBlock',
      'getPastEvents',
      'getContract',
      'getTime'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async init() {
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
      em.on("data", (block)=>{

        if(block) {
          this.block = block.number;
          this.times[this.block] = block.timestamp;
          //TODO: cleanup times if the client will run for a long time!
        }

      });

      let master = new this.web3.eth.Contract(abi, DEFAULT_MASTER_CONTRACT, {
        address: DEFAULT_MASTER_CONTRACT
      });
      let tellor = new this.web3.eth.Contract(abi, DEFAULT_TELLOR_CONTRACT, {
        address: DEFAULT_TELLOR_CONTRACT
      });
      console.log("Creating contract");
      this.contract = new ConAPI({chain: this, master, tellor, caller: acts[0]});
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

  getPastEvents(event, opts, callback) {
    return this.web3.getPastEvents(event, opts, callback);
  }

  getContract(props) {
    return this.contract;
  }

}
