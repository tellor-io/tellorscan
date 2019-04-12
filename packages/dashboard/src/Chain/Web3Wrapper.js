import Web3 from 'web3';
import {
  DEFAULT_MASTER_CONTRACT,
  DEFAULT_TELLOR_CONTRACT
} from 'Constants/chain/web3Config';
import abi from 'Chain/abi';
import SubscriptionProvider from './SubscriptionProvider';
import EventEmitter from 'events';

class ConAPI {
  constructor({master, tellor, caller}) {
    this.master = master;
    this.caller = caller;
    this.tellor = tellor;
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

    master.events.allEvents(null, (e, evt) => {
      console.log("Getting event from MASTER", evt);
      this._emitter.emit(evt.event, evt);
    });
    tellor.events.allEvents(null, (e, evt) => {
      console.log("Getting event from TELLOR", evt);
      this._emitter.emit(evt.event, evt);
    });

    [
      'init',
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
    console.log("Calling", method, args);
    return con.methods[method](...args).call({
      from: this.caller,
      gas: 100000
    });
  }

  _send(con, method, args) {
    return con.methods[method](...args).send({
      from: this.caller
    });
  }

  async init() {
    //could we pull current stuff from contract and cache it here?
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
    return this._send(this.tellor, "requestData", [queryString, symbol, requestId, multiplier, tip]);
  }

  addTip(requestId, tip) {
    return this._send(this.tellor, "addTip", [requestId, tip]);
  }
}

export default class Web3Wrapper {
  constructor(props) {

    [
      'init',
      'getBlock',
      'latestBlock',
      'getPastEvents',
      'getContract'
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
      this.web3.eth.subscribe('newBlockHeaders', (e, block) => {
        console.log("Incoming newBlockHeader", e, block);
        this.block = block?block.number:this.block;
      });

      let master = this.web3.eth.Contract(abi, DEFAULT_MASTER_CONTRACT, {
        address: DEFAULT_MASTER_CONTRACT
      });
      let tellor = this.web3.eth.Contract(abi, DEFAULT_TELLOR_CONTRACT, {
        address: DEFAULT_TELLOR_CONTRACT
      });
      this.contract = new ConAPI({master, tellor, caller: acts[0]});
    }
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
