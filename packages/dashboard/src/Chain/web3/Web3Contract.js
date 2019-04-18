import EventEmitter from 'events';
import SubscriptionProvider from '../SubscriptionProvider';
import eventFactory from 'Chain/LogEvents/EventFactory';

export default class Web3Contract {
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

    [
      'init',
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
      'beginDispute',
      'vote',
      '_call',
      '_send'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async getPastEvents(event, opts, callback) {
    //we have to intercept results from get past events because all event
    //creations will expect to retrieve the timestamp for each block
    //so we need to have the time available before any event gets distributed
    //downstream.

    let r = await this.master.getPastEvents(event||"allEvents", opts, async (err, events) => {
      if(events) {

        //we need to replay the blocks in their ascending time order. So we
        //first make sure blocks are sorted by blockNumber and logIndex
        events.sort((a,b)=>{
          let diff = a.blockNumber - b.blockNumber;
          if(diff) {
            return diff;
          }
          return a.logIndex = b.logIndex;
        });
        for(let i=0;i<events.length;++i) {
          let e = events[i];
          let b = await this.chain.web3.eth.getBlock(e.blockNumber);
          if(b) {
            this[b.blockNumber] = b.timestamp;
            //apply the time to the event as well
            e.timestamp = b.timestamp;
            await this.chain._storeBlockTime(b);
          }
        }
        if(callback) {
          let p = callback(events);
          if(p instanceof Promise) {
            await p;
          }
        }
        return events;
      }
      if(err)
        throw err;
    });
    return r;
  }

  async startSubscriptions() {
    //first, read all past events based on gaps in blocks received
    //going back up to 7 days (roughly 56k blocks)
    /*
    let gaps = await this.chain.getMissingBlockRanges();
    gaps.forEach(async g=> {
      //read all past events in missing block range
      await this.getPastEvents(null, {
        fromBlock: g.start,
        toBlock: g.end
      }, (events) => {
        //emit them as if they just arrived
        events.forEach(e=>{
          let outEvent = eventFactory(e);
          if(outEvent) {
            console.log("Emitting ", outEvent);
            this._emitter.emit(outEvent.name, outEvent);
          }
        })
      })
    });
    */

    this.sub = this.master.events.allEvents(null, (e, evt)=>{
      if(evt) {
        //console.log("Getting event from MASTER", evt);
        let outEvent = eventFactory(evt);
        if(outEvent) {
          this._emitter.emit(outEvent.name, outEvent);
        }
      }
    });
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

  requestData(queryString, symbol, requestId, multiplier, tip) {
    return this._send(this.master, "requestData", [queryString, symbol, requestId, multiplier, tip]);
  }

  addTip(requestId, tip) {
    return this._send(this.master, "addTip", [requestId, tip]);
  }

  beginDispute() {

  }

  vote() {

  }
}
