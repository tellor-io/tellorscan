import * as ethUtils from 'web3-utils';
import eventFactory from '../../LogEvents/EventFactory';
import {isURL} from 'Utils/strings';
import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {generateQueryHash} from 'Chain/utils';

const buildEvent = (payload) => {
  let hash = ethUtils.sha3(JSON.stringify(payload));
  payload.transactionHash = hash;
  payload.timestamp = Math.floor(Date.now()/1000);
  return eventFactory(payload);
}

class Query {
  constructor(props) {
    this.apiId = props._apiId;
    this.apiString = props._sapi;
    this.apiHash = props._apiHash;
    this.granularity = props._granularity;
    this.payout = props._value;
    this.index = props.index;
    this.symbol = props._symbol;
  }
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
    //the challenge issued to miners awaiting response
    this.currentChallenge = null;

    //the hash proposed to miners to solve with
    this.challengeHash = null;

    //the topmost bid item
    this.nextChallenge = null;

    //current mined values
    this.minedSlots = [];

    //id counter
    this.requests = 0;

    //all requests by their hash or query string and granularity
    this.requestsByHash = {};

    //all requests by id
    this.requestsById = {};

    //pending query requests sorted by highest tip
    this.pending = [];

    //pending queries by their api id
    this.pendingById = {};

    this.supportedInterface = [
      'requestData',
      'addTip',
      'proofOfWork',
      'getVariables',
      'getVariablesOnQ',
      'payoutPool',
      'getApiVars',
      'updateQueue',
      'nextUp',
      'count',
      '_storeState',
      'init',
      'getApiId'
    ];
    this.supportedInterface.forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async init() {
    let r = await Storage.instance.readAll({
      database: dbNames.ChainData,
      limit: 50
    });
    let hiId = 0;
    r.forEach(req=>{
      this.requestsById[req.apiId] = req;
      this.requestsByHash[req.apiHash] = req;
      if(req.apiId-0 > hiId) {
        hiId = req.apiId - 0;
      }
    });
    this.requests = hiId;
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
      challenge._api,
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
        console.log("No api found with id", _apiId);
        return [null, null, 0, 51, 0];
      }

      let index = 51;
      for(let i=0;i<this.pending.length;++i) {
        if(this.pending[i].apiId === _apiId) {
          index = i;
          break;
        }
      }

      return [
        req.apiString,
        req.symbol,
        req.apiHash,
        req.granularity,
        index,
        req.payout
      ];
  }

  async getApiId(hash) {
    let req = this.requestsByHash[hash];
    return req ? req.apiId : 0;
  }


  async getVariablesOnQ() {
    let req = this.nextCandidate;
    if(!req) {
      return [null, null, 0, 0, 0];
    }

    return [
      req._apiOnQ, //hash
      req._apiOnQPayout, //tip
      req._sapi //query string
    ];

  }

  async addTip(requestId, tip) {
    let req = this.requestsById[requestId];
    if(req) {
      return this.requestData(req.apiString, req.symbol, requestId, req.granularity, tip);
    }
  }

  async requestData(queryString, symbol, apiId, multiplier, tip) {
    if(multiplier < 0) {
      throw new Error("Multiplier cannot be less than 0 or larger than 1e18");
    }
    console.log("Incoming request params", queryString, apiId, multiplier, tip, symbol);
    let hash = generateQueryHash(queryString, multiplier);
    console.log("Query hash", hash);

    let existing = this.requestsByHash[hash];
    console.log("Existing", existing);

    if(apiId === 0){
      if(!isURL(queryString)) {
        throw new Error("Invalid query string");
      }
      if(!existing) {
        ++this.requests;
        apiId = this.requests;
        let newQuery = new Query({
          _apiId: apiId,
          _sapi: queryString,
          _apiHash: hash,
          _granularity: multiplier,
          _value: 0,
          _symbol: symbol,
          index: 0
        });
        this.requestsById[apiId] = newQuery;
        this.requestsByHash[hash] = newQuery;
      } else {
        apiId = existing.apiId;
      }
    }

    if(tip > 0) {
      this.requestsById[apiId].payout += tip;
    }
    await this.updateQueue(apiId);
    if(existing) {
      let payload = {
        event: "TipAdded",
        blockNumber: this.chain.blockNumber,
        logIndex: 1,
        returnValues: {
          sender: this.chain.userAddress,
          _apiId: existing.apiId,
          _value: existing.payout
        }
      };
      let evt = buildEvent(payload);
      this.chain.publishEvent(evt);
    } else {
      let payload = {
        event: "DataRequested",
        blockNumber: this.chain.block,
        logIndex: 1,
        returnValues: {
          sender: this.chain.userAddress,
          _sapi: queryString,
          _granularity:multiplier,
          _apiId: apiId,
          _value: tip,
          _symbol: symbol
        }
      };
      await this._storeState();
      let reqEvent = buildEvent(payload);
      reqEvent.hash = hash;
      this.chain.publishEvent(reqEvent);
    }

  }

  /**
   * In the simulation, the miner passes back the challenge hash. In the
   * real contract, the hash is analyzed against the nonce using PoW algo.
   * There is also a race in JS in that multiple simulation miners are hitting
   * this function at the same time. That doesn't happen on-chain so passing
   * the challenge hash keeps things straight
   */
  async proofOfWork(miner,  nonce,  _apiId, _value, cHash)  {
    if(_apiId !== this.currentChallenge.apiId) {
      throw new Error("Invalid api id submitted by miner");
    }

    let payload = {
      event: "NonceSubmitted",
      blockNumber: this.chain.block,
      logIndex: 0,
      returnValues: {
        _miner: miner,
        _nonce: nonce,
        _apiId,
        _value,
        _currentChallenge: cHash
      }
    };

    let evt = buildEvent(payload);
    this.chain.publishEvent(evt); //for now, lot more logic to work on here
    this.minedSlots.push(evt);
    if(this.minedSlots.length === 5) {

      let total = this.minedSlots.reduce((v, m)=>v+(m._value-0), 0);
      let avg = total / 5;

      this.minedSlots = [];
      payload = {
        event: "NewValue",
        blockNumber: this.chain.block,
        logIndex: 2,
        returnValues: {
          _apiId,
          _time: Math.floor(Date.now()/1000),
          _value: avg,
          _challengeHash: cHash
        }
      };
      //t-up the next one
      await this.nextUp();
      //publish the event
      let evt = buildEvent(payload);
      this.chain.publishEvent(evt);
    }
    this.chain.incrementBlock();
  }

  async updateQueue(apiId) {
    let query = this.requestsById[apiId];
    if(!this.currentChallenge || this.currentChallenge.apiId === 0) {
      this.challengeHash = ethUtils.sha3(""+((Math.random()*1000)+query.payout+this.chain.block));
      this.currentChallenge = {
        ...query
      };

      let payload = {
        event: "NewChallenge",
        blockNumber: this.chain.block,
        logIndex: 0,
        returnValues: {
          _currentChallenge: this.challengeHash,
          _miningApiId: apiId,
          _difficulty_level: 1,
          _api: query.apiString,
          _value: this.currentChallenge.payout
        }
      }
      //zero out tip since it's now being mined and any subsequent tips
      //would be for the Next proposed request
      query.payout = 0;
      await this._storeState();
      let evt = buildEvent(payload);
      this.chain.publishEvent(evt);
      return;
    }

    if(!this.nextChallenge || this.nextChallenge.payout < query.payout) {
      this.nextChallenge = {
        ...query
      };
      let payload = {
        event: "NewAPIonQinfo",
        blockNumber: this.chain.block,
        returnValues: {
            _apiId: this.nextChallenge.apiId,
            _sapi: this.nextChallenge.apiString,
            _apiOnQ: this.nextChallenge.apiHash,
            _apiOnQPayout: this.nextChallenge.payout
        }
      };
      let evt = buildEvent(payload);
      this.chain.publishEvent(evt);
    }
    this.pendingById[query.apiId] = query;
    this.pending = _.keys(this.pendingById).map(k=>this.pendingById[k]);
    this.pending.sort((a,b)=>{
      return b.payout - a.payout//descending order by tip
    });
    //the solidity code does not keep a sorted list and uses index references
    //to accomplish sorting. Here, we simply update the list, sort it,
    //and then trim the fat
    if(this.pending.length > 50) {
      this.pending = this.pending.slice(0, 50);
    }
  }

  async nextUp() {
    this.pending.sort((a,b)=>{
      return b.payout - a.payout//descending order by tip
    });
    let top = this.pending.shift() || {};
    if(top) {
      delete this.pendingById[top.apiId];
    }

    let payload = {
      event: "NewChallenge",
      blockNumber: this.chain.block,
      logIndex: 1,
      returnValues: {
        _currentChallenge: ethUtils.sha3(""+((Math.random()*1000)+(top.payout||0))),
        _miningApiId: top.apiId || 0,
        _difficulty_level: 1,
        _api: top.apiString,
        _value: top.payout
      }
    };

    let evt = buildEvent(payload, "NewChallenge");
    this.currentChallenge = top.apiString?{
      ...top
    }:undefined;
    let ex = this.requestsById[top.apiId];
    if(ex) {
      ex.payout = 0;
    }
    await this._storeState();
    this.chain.publishEvent(evt);
  }

  async _storeState() {
    //we mainly need to store queries for now
    _.keys(this.requestsById).forEach(async k=>{
      let req = this.requestsById[k];
      await Storage.instance.create({
        database: dbNames.ChainData,
        key: k,
        data: req
      })
    });
  }
}
