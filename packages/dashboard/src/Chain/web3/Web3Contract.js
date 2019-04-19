import EventEmitter from 'events';
import SubscriptionProvider from '../SubscriptionProvider';
import eventFactory from 'Chain/LogEvents/EventFactory';
import Storage from 'Storage';

let singleton = null;
export default class Web3Contract {
  constructor({chain, master, tellor, caller}) {
    singleton = this;

    this.chain = chain;
    this.master = master;
    this.caller = caller;
    this.tellor = tellor;
    this.eventHistory = {};
    this._emitter = new EventEmitter();

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
      'getTokens',
      'balanceOf',
      '_call',
      '_send'
    ].forEach(fn=>this[fn]=this[fn].bind(this));


    /*
     * So here's the deal. Because contracts are broken out into libs,
     * master, and tellor, the events would not be coming from any single
     * one of these contracts. So, we need to listen to all of them and
     * create a single notification mechanism so that the app is isolated
     * from all this complexity.
     */
    this._emitter = new EventEmitter();
    this.events = new SubscriptionProvider({
      chain: this._emitter //pretend our emitter is the blockchain
    });

    console.log("Subscribing to events....");
    this.sub = this.master.events.allEvents(null, async (e, evt)=>{
      if(singleton !== this) {
        throw new Error("Multiple contracts created somewhere");
      }
      if(evt) {
        //console.log("Getting event from MASTER", evt);
        let outEvent = eventFactory(evt);
        if(outEvent) {
          let time = await this.chain.getTime(outEvent.blockNumber);
          outEvent.timestamp = time;
          this._emitter.emit(outEvent.name, outEvent);
        }
      }
    });
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
          }, (e, r)=>{
            if(e) {
              err(e);
            } else {
              done(r);
            }
          });
      });
  }

  async init() {

    //pull all missing data and write to storage. This will make
    //initialization of all event structures seamless as they pull
    //history from storage during their initialization
    let gaps = await this.chain.getMissingBlockRanges();

    for(let i=0;i<gaps.length;++i) {
      let g = gaps[i];
      console.log("Recovering event gap", g.start, "-", g.end);
      let evts = await this.getPastEvents(null, {
        fromBlock: g.start,
        toBlock: g.end
      });
      console.log("Retrieved", evts.length, "past events");
      for(let j=0;j<evts.length;++j) {
        let evt = evts[j];
        let e = eventFactory(evt);
        if(e) {
          console.log("Storing event", e.event);
          if(!e.timestamp) {
            let ts = await this.chain.getTime(e.blockNumber);
            e.timestamp = ts;
          }
          await Storage.instance.create({
            database: e.event,
            key: e.transactionHash,
            data: e.toJSON()
          });
        }
      }
    }
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

  getTokens() {

    //nice fn name :(
    return this._send(this.master, "theLazyCoon", [this.caller,1000]);
  }

  balanceOf(addr) {
    return this._call(this.master, "balanceOf", [addr]);
  }

  beginDispute() {

  }

  vote() {

  }
}
