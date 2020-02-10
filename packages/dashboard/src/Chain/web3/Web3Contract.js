import EventEmitter from 'events';
import SubscriptionProvider from '../SubscriptionProvider';

/**
 * Abstraction of smart contract. Dashboard interacts with contract interface
 * and this implementation deals with txn submissions, etc.
 */
export default class Web3Contract {
  constructor({chain, master, tellor, address, caller}) {

    this.chain = chain;
    this.master = master;
    this.caller = caller;
    this.address = address;
    this.eventHistory = {};
    this._emitter = new EventEmitter();

    [
      'init',
      'emitEvents',
      'getPastEvents',
      'startSubscriptions',
      'unload',
      'requestData',
      'addTip',
      'getCurrentVariables',
      'getVariablesOnDeck',
      'getRequestVars',
      'getRequestIdByQueryHash',
      'getMinersByRequestIdAndTimestamp',
      'getDisputeIdByDisputeHash',
      'getAllDisputeVars',
      'getDisputeDetails',
      'beginDispute',
      'didVote',
      'isInDispute',
      'vote',
      'getTokens',
      'balanceOf',
      '_call',
      '_send'
    ].forEach(fn=>{
      if(!this[fn]) { throw new Error("Web3Contract missing fn: " + fn)}
      this[fn]=this[fn].bind(this);
    });

    //treat a single event emitter as if the blockchain is emitting
    //events to the subscription provider. Again, abstracting subscriptions
    //from the rest of the dashboard.
    this._emitter = new EventEmitter();
    this.events = new SubscriptionProvider({
      chain: this._emitter //pretend our emitter is the blockchain
    });
  }

  /**
   * Called when a new block arrives and all log events have been extracted.
   */
  emitEvents(events) {
    console.log("Emitting events", events);
    this._emitter.emit("blockEvents", {events});
  }

  /**
   * Read past events from blockchain. This follows normal web3 interface but adds
   * additional functionality of retrieving and storing blocks locally for future reference.
   */
  getPastEvents(event, opts, callback) {
    return new Promise((done,err)=>{
      this.master.getPastEvents(event||"allEvents", opts, async (e, events) => {
        if(e) {
          console.log("getPastEvents error" ,e);
          return err(e);
        }

        if(events) {
          console.log("Events returned from master", events);

          //we need to replay the blocks in their ascending time order. So we
          //first make sure blocks are sorted by blockNumber and logIndex
          events.sort((a,b)=>{
            let diff = a.blockNumber - b.blockNumber;
            if(diff) {
              return diff;
            }
            return a.logIndex - b.logIndex;
          });

          /*
          for(let i=0;i<events.length;++i) {
            let e = events[i];
            let b = await this.chain.web3.eth.getBlock(e.blockNumber);
            if(b) {
              this[b.blockNumber] = b.timestamp;
              //apply the time to the event as well
              e.timestamp = b.timestamp;
              //await this.chain._storeBlockTime(b);
            }
          }
          */

          if(callback) {
            let p = callback(events);
            if(p instanceof Promise) {
              await p;
            }
          }
          return done(events);
        }
        if(err)
          throw err;
      });
    });


  }

  async startSubscriptions() {
    //no-op
  }

  /**
   * Make a contract call
   */
  _call(con, method, args) {
    return con.methods[method](...args).call({
      from: this.caller,
      gas: 100000
    });
  }

  /**
   * Submit a contract transaction.
   */
  _send(con, method, args) {
    let tx = con.methods[method](...args);

      return new Promise((done,err)=>{
        console.log("calling this: ",this.address, this.caller)
        this.chain.web3.eth.sendTransaction({
            to: this.address,
            from: this.caller,
            data: tx.encodeABI(),
            //chainId: 999
          }, (e, r)=>{
            if(e) {
              console.log("Caught error immediately", e);
              err(e);
            } else {
              done(r);
            }
          });
      });
  }

  async init() {
    //nothing to do
  }

  /**
   * attempt to clean subscriptions. May or may not be called
   * when page unloads
   */
  async unload() {
    if(this.sub) {
      await this.sub.unsubscribe();
      this.sub = null;
    }
  }

  //following are all same functions from solidity code

  getCurrentVariables() {
    return this._call(this.master, "getCurrentVariables", []);
  }

  getRequestVars(_apiId) {
    return this._call(this.master, "getRequestVars", [_apiId]);
  }

  getRequestIdByQueryHash(hash) {
    return this._call(this.master, "getRequestIdByQueryHash", [hash]);
  }

  getVariablesOnDeck() {
    return this._call(this.master, "getVariablesOnDeck", []);
  }

  getMinersByRequestIdAndTimestamp(requestId, timestamp) {
    return this._call(this.master, "getMinersByRequestIdAndTimestamp", [requestId, timestamp]);
  }

  requestData(queryString, symbol, multiplier, tip) {
    return this._send(this.master, "requestData", [queryString, symbol, multiplier, tip]);
  }

  addTip(requestId, tip) {
    console.log("in the contract file")
    return this._send(this.master, "addTip", [requestId, tip]);
  }

  getTokens(addr) {

    //nice fn name :(
    return this._send(this.master, "theLazyCoon", [addr,"1000000000000000000000"]);
  }

  balanceOf(addr) {
    return this._call(this.master, "balanceOf", [addr]);
  }

  getDisputeIdByDisputeHash(hash) {
    return this._call(this.master, "getDisputeIdByDisputeHash", [hash]);
  }

  getAllDisputeVars(id) {
    return this._call(this.master, "getAllDisputeVars", [id]);
  }

  async getDisputeDetails(id) {
    let vars = await this.getAllDisputeVars(id);
    /*  return(
      disp.hash,                                              0
      disp.executed,                                          1
      disp.disputeVotePassed,                                 2
      disp.isPropFork,                                        3
      disp.reportedMiner,                                     4
      disp.reportingParty,                                    5
      disp.proposedForkAddress,                               6
      [
        disp.disputeUintVars[keccak256("requestId")],         7.0
        disp.disputeUintVars[keccak256("timestamp")],         7.1
        disp.disputeUintVars[keccak256("value")],             7.2
        disp.disputeUintVars[keccak256("minExecutionDate")],  7.3
        disp.disputeUintVars[keccak256("numberOfVotes")],     7.4
        disp.disputeUintVars[keccak256("blockNumber")],       7.5
        disp.disputeUintVars[keccak256("minerSlot")],         7.6
        disp.disputeUintVars[keccak256("quorum")]             7.7
      ],
      disp.tally                                              8
    );
    */
    if(!vars[0]) {
      return null;
    }
    return {
      _disputeId: id,
      _requestId: vars[7][0],
      _miner: vars[4]
    }
  }

  beginDispute(requestId, timestamp, minerIndex) {
    return this._send(this.master, "beginDispute", [requestId, timestamp, minerIndex]);
  }

  didVote(disputeId, user) {
    return this._call(this.master, "didVote", [disputeId, user]);
  }

  vote(disputeId, supportsDisputer) {
    return this._send(this.master, "vote", [disputeId, supportsDisputer]);
  }

  async isInDispute(address) {
    let vars = await this._call(this.master, "getStakerInfo", [address]);
    return (vars[0].toString()-0)===3;
  }
}
