import * as ethUtils from 'web3-utils';
import eventFactory from '../../LogEvents/EventFactory';
import {isURL} from 'Utils/strings';
import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {generateQueryHash, generateDisputeHash} from 'Chain/utils';
import {normalizeToMinute} from 'Utils/time';

const buildEvent = (payload) => {
  let hash = ethUtils.sha3(JSON.stringify(payload));
  payload.transactionHash = hash;
  payload.timestamp = Math.floor(Date.now()/1000);
  return eventFactory(payload);
}

const MAX_DISPUTE_TIME = 86400; //1 day

class Query {
  constructor(props) {
    this.apiId = props._apiId;
    this.apiString = props._sapi;
    this.apiHash = props._apiHash;
    this.granularity = props._granularity;
    this.payout = props._value;
    this.index = props.index;
    this.symbol = props._symbol;
    this.minedValuesByTimestamp = {};
    this.minersByTimestamp = {};
    this.challengeHashByTimestamp = {};
  }
}

class Dispute {
  constructor(props) {
    this.id = props.id;
    this.apiId = props.apiId;
    this.hash = props.hash;
    this.challengeHash = props.challengeHash;
    this.value = props.value;
    this.isPropFork = props.isPropFork;
    this.reportedMiner = props.miner;
    this.reportingParty = props.sender;
    this.propForkAddress = props.propForkAddress || null;
    this.executed = props.executed || false;
    this.disputeVotePassed = props.disputeVotePassed || false;
    this.tally = props.tally || 0;
    this.timestamp = props.timestamp;
    this.minerSlot = props.minerSlot;
    this.numberOfVotes = props.numberOfVotes || 0;
    this.quorum = props.quorum || 0;
    this.voted = props.voted || [];
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

    //request id counter
    this.requests = 0;

    this.challengesByHash = {};

    //all requests by their hash or query string and granularity
    this.requestsByHash = {};

    //all requests by id
    this.requestsById = {};

    //disputes by their hashed miner, apiId, and timestamp
    this.disputesByHash = {};

    //disputes by time slot. Maps normalized time to list of disputes
    this.disputesByTime = {};

    //disputes by dispute id.
    this.disputesById = {};

    //dispute id counter
    this.disputes = 0;

    //disputes that have been initiated keyed by hash of
    //miner address, apiId, and time block
    this.disputesByMinedHash = {};

    //pending query requests sorted by highest tip
    this.pending = [];

    //pending queries by their api id
    this.pendingById = {};

    this.supportedInterface = [
      'requestData',
      'addTip',
      'proofOfWork',
      'beginDispute',
      'getCurrentVariables',
      'getVariablesOnDeck',
      'getMinersByRequestIdAndTimestamp',
      'getDisputeIdByDisputeHash',
      'getDisputeById', //TODO: rename/refactor once option is available on chain
      'vote',
      'didVote',
      'getRequestVars',
      'updateQueue',
      'nextUp',
      'count',
      '_storeState',
      'init',
      'getApiId',
      'getTokens',
      'balanceOf'
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
    r = await Storage.instance.readAll({
      database: dbNames.ChainDisputes,
      limit: 50
    });
    hiId = 0;
    r.forEach(disp => {
      this.disputesById[disp.id] = disp;
      let vals = this.disputesByTime[disp.timestamp] || [];
      vals.push(disp);
      this.disputesByTime[disp.timestamp] = vals;
      this.disputesByHash[disp.hash] = disp;

      if(disp.id-0 > hiId) {
        hiId = disp.id - 0;
      }
    });
    this.disputes = hiId;
  }

  async getCurrentVariables() {
    if(!this.currentChallenge) {
      return [0, 0, 0, null, 0];
    }

    let challenge = {
      ...this.currentChallenge
    }
    return [
      challenge.challengeChallenge,
      challenge.apiId,
      challenge.difficulty_level,
      challenge.api,
      challenge.granularity
    ]
  }

  async getDisputeIdByDisputeHash(hash) {
    let d = this.disputesByHash[hash];
    if(d) {
      return d.id;
    }
    return 0;
  }

  /** TODO: refactor this after contract mods made **/
  async getDisputeById(id) {
    let d = this.disputesById[id];
    return [
      d.hash,
      d.executed,
      d.disputeVotePassed,
      d.isPropFork,
      d.reportedMiner,
      d.reportingParty,
      d.proposedForkAddress,
      d.apiId,
      d.timestamp,
      d.value,
      d.minExecutionDate,
      d.numberOfVotes,
      d.minerSlot,
      d.tally
    ];
  }

  async count() {
    return this.minedSlots.length;
  }

  async payoutPool() {
    return this.pending.map(p=>p._apiId);
  }

  async getRequestVars(_apiId) {
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

  async getRequestIdByQueryHash(hash) {
    let req = this.requestsByHash[hash];
    return req ? req.apiId : 0;
  }


  async getVariablesOnDeck() {
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

  async getMinersByRequestIdAndTimestamp(requestId, timestamp) {
    let req = this.requestsById[requestId];
    if(!req) {
      return []
    };
    let miners = req.minersByTimestamp[timestamp] || [];
    return miners;
  }

  async beginDispute(requestId, timestamp, minerIndex) {
    let req = this.requestsById[requestId];
    if(!req) {
      throw new Error("No request found with id: " + requestId);
    }
    let now = Math.floor(Date.now()/1000);
    let miners = req.minersByTimestamp[timestamp];
    if(!miners) {
      throw new Error("No mining performed at timestamp: " + timestamp);
    }
    if(now- timestamp > MAX_DISPUTE_TIME) {
      throw new Error("Cannot dispute 24 hours beyond time of mined event");
    }
    if(minerIndex >= 5) {
      throw new Error("Miner index must be < 5");
    }

    let miner = miners[minerIndex];
    let dispHash = generateDisputeHash({miner,requestId:req.apiId,timestamp});
    let ex = this.disputesByHash[dispHash];
    if(ex) {
      throw new Error("Mined value is already under dispute");
    }
    ++this.disputes;
    let did = this.disputes;
    let val = req.minedValuesByTimestamp[timestamp];

    this.disputesByHash[dispHash] = did;
    let disp = new Dispute({
      id: did,
      apiId: requestId,
      hash: dispHash,
      isPropFork: false,
      reportedMiner: miner,
      reportingParty: null, //maybe need it later
      propForkAddress: null,
      executed: false,
      disputeVotePassed: false,
      tally: 1,
      value: val,
      timestamp: timestamp,
      minExecutionDate: timestamp + (7*86400),
      minerSlot: minerIndex
    });
    this.disputesById[did] = disp;
    this.disputesByHash[dispHash] = disp;

    let vals = this.disputesByTime[timestamp] || [];
    vals.push(disp);
    this.disputesByTime[timestamp] = vals;

    await Storage.instance.create({
      database: dbNames.ChainDisputes,
      key: dispHash,
      data: disp
    });
    let payload = {
      event: "NewDispute",
      blockNumber: this.chain.block,
      logIndex: 0,
      returnValues: {
        sender: this.chain.userAddress,
        _requestId: disp.apiId,
        _value: disp.value,
        _disputeId: did,
        _timestamp: timestamp,
        _challengeHash: req.challengeHashByTimestamp[timestamp],
        _disputeHash: dispHash,
        _miner: miner
      }
    };
    let evt = buildEvent(payload);
    this.chain.publishEvent(evt);
  }

  async vote(sender, _disputeId, _supportsDispute) {
    let disp = this.disputesById[_disputeId];
    if(disp.voted[sender]) {
      throw new Error("Can only vote once");
    }
    disp.voted[sender] = true;
    disp.numberOfVotes += 1;
    if (_supportsDispute) {
      disp.tally++;
    } else {
      disp.tally--;
    }
    let payload = {
      event: "Voted",
      blockNumber: this.chain.block,
      logIndex: 0,
      returnValues: {
        _disputeId: disp.id,
        _position: _supportsDispute,
        _voter: sender
      }
    };
    let evt = buildEvent(payload);
    this.chain.publishEvent(evt);
  }

  async getTokens() {
    //no op
  }

  async balanceOf(address) {
    return 10000;
  }

  async didVote(disputeId, address) {
    
  }

  async addTip(requestId, tip) {
    let req = this.requestsById[requestId];
    if(req) {
      return this.requestData(req.apiString, req.symbol, requestId, req.granularity, tip);
    }
  }

  async requestData(queryString, symbol, requestId, multiplier, tip) {
    if(multiplier < 0) {
      throw new Error("Multiplier cannot be less than 0 or larger than 1e18");
    }
    let hash = generateQueryHash(queryString, multiplier);

    let existing = this.requestsByHash[hash];
    if(requestId === 0){
      if(!isURL(queryString)) {
        throw new Error("Invalid query string");
      }
      if(!existing) {
        ++this.requests;
        requestId = this.requests;
        let newQuery = new Query({
          _apiId: requestId,
          _sapi: queryString,
          _apiHash: hash,
          _granularity: multiplier,
          _value: 0,
          _symbol: symbol,
          index: 0
        });
        this.requestsById[requestId] = newQuery;
        this.requestsByHash[hash] = newQuery;
      } else {
        requestId = existing.apiId;
      }
    }

    if(tip > 0) {
      this.requestsById[requestId].payout += tip;
    }
    await this.updateQueue(requestId);
    if(existing) {
      let payload = {
        event: "TipAdded",
        blockNumber: this.chain.block,
        logIndex: 1,
        returnValues: {
          sender: this.chain.userAddress,
          _requestId: existing.apiId,
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
          _query: queryString,
          _granularity:multiplier,
          _requestId: requestId,
          _totalTips: tip,
          _querySymbol: symbol
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
  async proofOfWork(miner,  nonce,  _requestId, _value, cHash)  {
    if(_requestId !== this.currentChallenge.apiId) {
      throw new Error("Invalid api id submitted by miner");
    }
    let ts = normalizeToMinute(Math.floor(Date.now()/1000));
    let payload = {
      event: "NonceSubmitted",
      blockNumber: this.chain.block,
      logIndex: 0,
      returnValues: {
        _miner: miner,
        _nonce: nonce,
        _requestId,
        _value,
        _currentChallenge: cHash,
        _timestamp: ts
      }
    };
    let req = this.requestsById[_requestId];
    let vals = req.minedValuesByTimestamp[ts] || [];
    vals.push({miner, value: _value});
    vals.sort((a,b)=>{
      return a.value - b.value;
    });
    req.minedValuesByTimestamp[ts] = vals;
    let miners = req.minersByTimestamp[ts] || [];
    miners.push(miner);
    req.minersByTimestamp[ts] = miners;
    req.challengeHashByTimestamp[ts] = cHash;

    let evt = buildEvent(payload);
    this.chain.publishEvent(evt); //for now, lot more logic to work on here
    this.minedSlots.push(evt);
    if(this.minedSlots.length === 5) {

      let total = this.minedSlots.reduce((v, m)=>v+(m._value-0), 0);
      let avg = total / 5;
      let sortedMiners = vals.map(v=>v.miner);
      req.minersByTimestamp[ts] = sortedMiners;

      this.minedSlots = [];
      payload = {
        event: "NewValue",
        blockNumber: this.chain.block,
        logIndex: 2,
        returnValues: {
          _requestId: _requestId,
          _time: ts,
          _value: avg,
          _currentChallenge: cHash
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
        ...query,
        _difficulty_level: 1,
        challengeHash: this.challengeHash
      };

      let payload = {
        event: "NewChallenge",
        blockNumber: this.chain.block,
        logIndex: 0,
        returnValues: {
          _currentChallenge: this.challengeHash,
          _currentRequestId: apiId,
          _multiplier: this.currentChallenge.granularity,
          _difficulty: 1,
          _query: query.apiString,
          _totalTips: this.currentChallenge.payout
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

    let nextHash = ethUtils.sha3(""+((Math.random()*1000)+(top.payout||0)));
    this.challengeHash = nextHash;
    let payload = {
      event: "NewChallenge",
      blockNumber: this.chain.block,
      logIndex: 1,
      returnValues: {
        _currentChallenge: nextHash,
        _currentRequestId: top.apiId || 0,
        _multiplier: top.granularity,
        _difficulty: 1,
        _query: top.apiString,
        _totalTips: top.payout
      }
    };

    let evt = buildEvent(payload, "NewChallenge");
    this.currentChallenge = top.apiString?{
      ...top,
      _difficulty: 1,
      challengeHash: nextHash
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
