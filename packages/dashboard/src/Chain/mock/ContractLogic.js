import * as eventTypes from 'Chain/LogEvents';
import * as ethUtils from 'web3-utils';
import _ from 'lodash';
import EventEmitter from 'events';
import eventFactory from '../LogEvents/EventFactory';

//used to conform to web3.eth.Contract.events interface for specific
//contract events
class EventQueryHandler {
  constructor(props) {
    this.chain = props.chain;
    this.allListeners = [];

    [
      'once',
      'allEvents',
      '_sub',
      '_filterAndNotify'
    ].forEach(fn=>this[fn]=this[fn].bind(this));

    //treat each defined event type as a function that user can
    //subscribe to.
    _.keys(eventTypes).forEach(nm=>{

      //just create subscription for event name
      this[nm] = (opts, cb) => {
        return this._sub(nm, opts, cb);
      };

      this.chain.on(nm, async (e)=>{
        if(e) {
          if(this.allListeners.length > 0) {
            let actual = e;
            if(!e.normalize) {
              actual = this._toLogEvent(e);
            }
            if(actual) {
              actual.normalize({
                chain: this.chain,
                storage: Storage()
              }).then(norm=>{
                this.allListeners.forEach(al=>{
                  this._filterAndNotify(al.options, al.callback, norm);
                });
              });
            } else {
              console.log("Could not decode to actual log event", e);
            }
          }
        }
      });

      //then bind the new function to this class
      this[nm] = this[nm].bind(this);
    });

  }

  async once(event, opts) {
    //event is name or 'allEvents' for any
    //opts has filter, topics array
    throw new Error("contractLogic.events.once not supported yet");
  }

  async allEvents(opts, cb)  {
    this.allListeners.push({
      options: opts,
      callback: cb
    });
  }


  _filterAndNotify(opts, cb, event, emitter) {
    let filter = opts?opts.filter:{};
    if(!filter) {
      filter = {};
    }
    if(!cb) {
      cb = ()=>{}
    }
    if(!emitter) {
      emitter = {
        emit: () => {}
      }
    }

    let props = _.keys(filter);
    if(props.length > 0) {
      props.forEach(k=>{
        let tgtVal = filter[k];
        let val = event[k];
        if(val) {
          if(Array.isArray(tgtVal)) {
            tgtVal.forEach(v=>{
              if(v === val) {
                cb(null, event);
                emitter.emit("data", event);
              }
            })
          } else if(val === tgtVal) {
            cb(null, event);
            emitter.emit("data", event);
          }
        }
      })
    } else {
      cb(null, event);
      emitter.emit("data", event);
    }
  }

  _sub(name, opts, cb) {
    let emitter = new EventEmitter();
    this.chain.on(name, (e)=>{
      if(e) {
        this._filterAndNotify(opts, cb, e, emitter);
      }
    });
    return emitter;
  }
}


const buildEvent = (payload, type) => {

  let hash = ethUtils.sha3(JSON.stringify(payload));
  payload.transactionHash = hash;
  payload.timestamp = Math.floor(Date.now()/1000);
  return eventFactory(payload);
}

/**
 * This is coupled to the mock chain and simulates the logic
 * performed in the actual solidity logic as closely as possible
 * so that the UI feels how it would feel when the real contract
 * is in use.
 */
export default class ContractLogic {
  constructor(props) {
    this.chain = props.chain;
    this.currentChallenge = null;
    this.nextCandidate = null;
    this.minedSlots = [];
    this.apiCounter = 0;
    this.requestsByHash = {};
    this.requestsById = {};
    this.pending = []; //pending query requests sorted by highest tip
    this.events = new EventQueryHandler(props);

    [
      'requestData',
      'proofOfWork',
      'getPastEvents',
      'getVariables',
      'getVariablesOnQ',
      'payoutPool',
      'getApiVars',
      'updateQueue',
      'nextUp',
      'count'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  getPastEvents(event, options, callback) {
    return this.chain.getPastEvents(event, options, callback);
  }

  async getVariables() {
    if(!this.currentChallenge) {
      return [0, 0, 0, null, 0];
    }

    let challenge = {
      ...this.currentChallenge
    }
    let details = this.requestsById[challenge._miningApiId] || {};
    return [
      challenge._currentChallenge,
      challenge._miningApiId,
      challenge._difficulty_level,
      details._sapi,
      details._granularity
    ]
  }

  async count() {
    return this.minedSlots.length;
  }

  async payoutPool() {
    return this.pending.map(p=>p._apiId);
  }

  async getApiVars(_apiId) {
      let req = this.requestsById[_apiId];
      if(!req) {
        return [null, null, 0, 51, 0];
      }

      let index = 51;
      for(let i=0;i<this.pending.length;++i) {
        if(this.pending[i]._apiId === _apiId) {
          index = i;
          break;
        }
      }

      return [
        req._sapi,
        req.hash,
        req._granularity,
        index,
        req._value
      ];
  }


  async getVariablesOnQ() {
    let req = this.pending[0];
    if(!req) {
      return [null, null, 0, 0, 0];
    }

    return [
      req._apiOnQ,
      req._apiOnQPayout,
      req._sapi
    ];

  }


  async requestData(queryString, apiId, multiplier, tip) {

    //otherwise, see if there is a challenge by its hash
    let hash = ethUtils.sha3(queryString + multiplier);
    let existing = this.requestsByHash[hash];
    if(existing) {
      //it means we really just want to increment the tip
      existing._value += tip;
      let payload = {
        event: "TipUpdated",
        blockNumber: this.chain.blockNumber,
        returnValues: {
          sender: this.chain.userAddress,
          _apiId: existing._apiId,
          _value: tip
        }
      };
      let evt = buildEvent(payload, "TipUpdated");
      this.chain.publishEvent(evt);
      this.updateQueue();
      return;
    }

    if(apiId === 0) {
      ++this.apiCounter;
      apiId = this.apiCounter;
    }

    //otherwise, it's a new request for data
    let payload = {
      event: "DataRequested",
      blockNumber: this.chain.block,
      returnValues: {
        sender: this.chain.userAddress,
        _sapi: queryString,
        _granularity:multiplier,
        _apiId: apiId,
        _value: tip
      }
    };
    let reqEvent = buildEvent(payload, "DataRequested");
    reqEvent.hash = hash;
    this.requestsByHash[hash] = reqEvent;
    this.requestsById[apiId] = reqEvent;

    //publish it
    this.chain.publishEvent(reqEvent);

    //if no challenge under way, create a new one

    if(!this.currentChallenge || this.currentChallenge._miningApiId === 0) {
      payload = {
        event: "NewChallenge",
        blockNumber: this.chain.block,
        returnValues: {
          _currentChallenge: ethUtils.sha3(""+((Math.random()*1000)+tip+this.chain.block)),
          _miningApiId: apiId,
          _difficulty_level: 1,
          _api: queryString
        }
      };
      let evt = buildEvent(payload, "NewChallenge");
      this.currentChallenge = evt;
      this.chain.publishEvent(evt);
      this.chain.incrementBlock();
    } else {
    //now sort the pending items by tip and
    //if leader changes
      this.pending.push(reqEvent);
      this.updateQueue()
    }
  }

  async proofOfWork(miner,  nonce,  _apiId, _value)  {
    let payload = {
      event: "NonceSubmitted",
      blockNumber: this.chain.block,
      returnValues: {
        _miner: miner,
        _nonce: nonce,
        _apiId,
        _value,
        _currentChallenge: this.currentChallenge._currentChallenge
      }
    };

    let evt = buildEvent(payload, "NonceSubmitted");
    this.chain.publishEvent(evt); //for now, lot more logic to work on here
    this.minedSlots.push(evt);
    if(this.minedSlots.length === 5) {
      let total = this.minedSlots.reduce((v, m)=>v+(m._value-0), 0);
      let avg = total / 5;
      payload = {
        event: "NewValue",
        blockNumber: this.chain.block,
        returnValues: {
          _apiId,
          _time: Math.floor(Date.now()/1000),
          _value: avg
        }
      };
      let evt = buildEvent(payload, "NewValue");
      this.minedSlots = [];
      this.currentChallenge = null;
      this.nextUp()
      this.chain.publishEvent(evt);
    }
    this.chain.incrementBlock();
  }

  updateQueue() {
    

    let top = this.pending[0];
    this.pending.sort((a,b)=>{
      return b._value - a._value//descending order by tip
    });
    this.pending = this.pending.slice(0, 50);
    let comp = this.pending[0];
    if(top !== comp) {
      let hash = ethUtils.sha3(top._sapi + top._granularity);
      //change in order
      let payload = {
        event: "NewAPIOnQinfo",
        blockNumber: this.chain.block,
        returnValues: {
            _apiId: top._apiId,
            _sapi: top._sapi,
            _apiOnQ: hash,
            _apiOnQPayout: top._value
        }
      };
      let newAPI = buildEvent(payload, "NewAPIOnQinfo");
      this.chain.publishEvent(newAPI);
      this.chain.incrementBlock();
    }
  }

  nextUp() {
    this.pending.sort((a,b)=>{
      return b.tip - a.tip//descending order by tip
    });
    let top = this.pending.shift() || {};

    let payload = {
      event: "NewChallenge",
      blockNumber: this.chain.block,
      returnValues: {
        _currentChallenge: ethUtils.sha3(""+((Math.random()*1000)+(top._value||0))),
        _miningApiId: top._apiId || 0,
        _difficulty_level: 1,
        _api: top._sapi
      }
    };
    let evt = buildEvent(payload, "NewChallenge");
    this.currentChallenge = evt;
    this.chain.publishEvent(evt);
  }
}
