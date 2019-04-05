import * as ethUtils from 'web3-utils';
import eventFactory from '../../LogEvents/EventFactory';
import {isURL} from 'Utils/strings';



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

    this.supportedInterface = [
      'requestData',
      'proofOfWork',
      'getVariables',
      'getVariablesOnQ',
      'payoutPool',
      'getApiVars',
      'updateQueue',
      'nextUp',
      'count'
    ];
    this.supportedInterface.forEach(fn=>this[fn]=this[fn].bind(this));
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


  async requestData(queryString, apiId, multiplier, tip) {
    if(multiplier < 0) {
      throw new Error("Multipler cannot be less than 0 or larger than 1e18");
    }

    let qPacked = this.chain.web3.eth.abi.encodeParameters(['string', 'uint'], [queryString, multiplier]);
    let hash = ethUtils.sha3(qPacked);
    let existing = this.requestsByHash[hash];

    if(apiId === 0){
      if(!isURL(queryString)) {
        throw new Error("Invalid query string");
      }
      //solidity uses abi.encodePacked, but in web3js, packed params are done by
      //treating them as params to a function and encoding them.
      if(!existing) {
        ++this.requests;
        apiId = this.requests;
        let newQuery = new Query({
          _apiId: apiId,
          _sapi: queryString,
          _apiHash: hash,
          _granularity: multiplier,
          _value: 0,
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
    this.updateQueue(apiId);
    if(existing) {
      let payload = {
        event: "TipUpdated",
        blockNumber: this.chain.blockNumber,
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
        returnValues: {
          sender: this.chain.userAddress,
          _sapi: queryString,
          _granularity:multiplier,
          _apiId: apiId,
          _value: tip
        }
      };
      let reqEvent = buildEvent(payload);
      reqEvent.hash = hash;
      this.chain.publishEvent(reqEvent);
    }
  }

  async proofOfWork(miner,  nonce,  _apiId, _value)  {
    if(_apiId !== this.currentChallenge.apiId) {
      throw new Error("Invalid api id submitted by miner");
    }

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

    let evt = buildEvent(payload);
    this.chain.publishEvent(evt); //for now, lot more logic to work on here
    this.minedSlots.push(evt);
    if(this.minedSlots.length === 5) {

      let total = this.minedSlots.reduce((v, m)=>v+(m._value-0), 0);
      let avg = total / 5;

      //solidity 0's out the payout at this point, even though I think it's an
      //accounting error since tips could have come in for the currently mined request
      //assuming it would up the antie for the next run. But it's 0'd out so the
      //next run wouldn't pay anything to the miner.
      let query = this.requestsById[_apiId];
      query.payout = 0;
      this.minedSlots = [];
      this.nextUp();

      payload = {
        event: "NewValue",
        blockNumber: this.chain.block,
        returnValues: {
          _apiId,
          _time: Math.floor(Date.now()/1000),
          _value: avg
        }
      };
      let evt = buildEvent(payload);
      this.chain.publishEvent(evt);
    }
    this.chain.incrementBlock();
  }

  updateQueue(apiId) {
    let query = this.requestsById[apiId];
    if(!this.currentChallenge || this.currentChallenge.apiId === 0) {
      this.challengeHash = ethUtils.sha3(""+((Math.random()*1000)+query.payout+this.chain.block));
      let payload = {
        event: "NewChallenge",
        blockNumber: this.chain.block,
        returnValues: {
          _currentChallenge: this.challengeHash,
          _miningApiId: apiId,
          _difficulty_level: 1,
          _api: query.apiString,
          _value: query.payout
        }
      }
      //should payout be zero'd out at this point? It's not in the solidity codebase
      //query.payout = 0; ???
      let evt = buildEvent(payload);
      this.currentChallenge = query;
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
    this.pending.push(query);
    this.pending.sort((a,b)=>{
      return b.payout - a.payout//descending order by tip
    });
    //the solidity code simply replaces the lowest payout
    //with the new query. We don't do that. Instead, we
    //simply update the list, sort it, and then trim the fat
    if(this.pending.length > 50) {
      this.pending = this.pending.slice(0, 50);
    }
  }

  nextUp() {
    this.pending.sort((a,b)=>{
      return b.payout - a.payout//descending order by tip
    });
    let top = this.pending.shift() || {};

    let payload = {
      event: "NewChallenge",
      blockNumber: this.chain.block,
      returnValues: {
        _currentChallenge: ethUtils.sha3(""+((Math.random()*1000)+(top.payout||0))),
        _miningApiId: top.apiId || 0,
        _difficulty_level: 1,
        _api: top.apiString
      }
    };

    let evt = buildEvent(payload, "NewChallenge");
    this.currentChallenge = top;
    this.chain.publishEvent(evt);
  }
}
