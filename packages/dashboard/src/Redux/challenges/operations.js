import {default as modalOps} from 'Redux/modals/operations';
import {Creators} from './actions';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import {getCurrentChallenge, dedupeNonces} from 'Chain/utils';
import {Logger} from 'buidl-utils';
import Factory from 'Chain/LogEvents/EventFactory';
import {default as reqOps} from 'Redux/newRequests/operations';
import * as ethUtils from 'web3-utils';

const log = new Logger({component: "NewChallengeOps"});

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());

  /*
  registerDeps([nonceTypes.ADD_NONCES], async (action)=>{
    log.info("Nonces were added, updating associated challenges...");
    await dispatch(addNoncesAndValues(action.nonces));
  });

  registerDeps([valTypes.ADD_NEW_VALUES], async (action)=> {
    await dispatch(addNoncesAndValues(null, action.values));
  });
  */


  try {
    
    let chals = await Storage.instance.readAll({
      database: DBNames.NewChallenge,
      sort: [
        {
          field: "blockNumber",
          order: "DESC"
        }
      ],
      limit: 50
    });
    let current = await dispatch(getCurrentChallenge());
    if(current && (current.id === 0 || current.challengeHash.length === 0)){
      current = undefined;
    } else if(current) {
      current = current.challengeHash;
    }
    chals = await dispatch(addNoncesAndValues(chals));
    dispatch(Creators.initSuccess(chals, current));
  } catch (e) {
    log.error("Problem initializing challenges", e);
    dispatch(Creators.failure(e));
  }
  
}

const addChallenges = (challenges, current) => (dispatch,getState) => {
  let byHash = getState().challenges.byHash;
  challenges.forEach(c=>{
    let m = byHash[c.challengeHash];
    if(m) {
      log.warn("Found existing challenge hash in place. Replacing with new one");
      
    }
  })
  dispatch(Creators.addChallenges(challenges, current));
  dispatch(addNoncesAndValues());
}

const setCurrentChallenge = hash => (dispatch) => {
  dispatch(Creators.setCurrent(hash))
}

const findChallenge = hash => async (dispatch, getState) => {
  let byHash = getState().challenges.byHash;
  let match = byHash[hash];
  if(match) {
    return match;
  }
  let r = await Storage.instance.read({
    database: DBNames.NewChallenge,
    key: hash
  });
  if(r) {
    return Factory({
      event: DBNames.NewChallenge,
      returnValues: {
        _currentChallenge: r.challengeHash,
        _requestId: r.id,
        _multiplier: r.multiplier,
        _totalTips: r.tip,
        _difficulty: r.difficulty
      },
      blockNumber: r.blockNumber
    });
  }
  return null;
}

const createChallenge = (reqId, hash) => async (dispatch, getState) => {
  let match = state.challenges.byHash[hash];
  if(match) {
    return match;
  }

  let state = getState();
  let req = await dispatch(reqOps.findRequestById(reqId));
  if(!req) {
    log.warn("Could not find request for challenge with id", reqId);
    return null;
  }
  let ch = Factory({
    event: DBNames.NewChallenge,
    returnValues: {
      _currentChallenge: hash,
      _requestId: reqId, 
      _multiplier: req.multiplier,
      _totalTips: 0,
      _difficulty: 0
    },
    blockNumber: 0
  });
  await Storage.instance.create({
    database: DBNames.NewChallenge,
    key: hash,
    data: ch.toJSON()
  });
  dispatch(Creators.addChallenges([ch]));
  return ch;
}

const addNonceToChallenge = (ch, nonce) => async (dispatch, getState) => {
  let existing = ch.nonces || [];
  existing = [
    ...existing,
    nonce
  ];
  existing = dedupeNonces(existing);
 
  ch = {
    ...ch,
    nonces: existing
  };
  dispatch(Creators.updateChallenges([ch]));
}

const addValueToChallenge = (ch, value) => async (dispatch, getState) => {
  ch = {
    ...ch,
    finalValue: value
  };
  dispatch(Creators.updateChallenges([ch]))
}

const addNoncesAndValues = (challenges) => async (dispatch, getState) => {
  
  challenges = challenges.reduce((o,c)=>{
    o[c.challengeHash] = c;
    return o;
  },{});
  
  let hashes = Object.keys(challenges);
  for(let i=0;i<hashes.length;++i) {
    let hash = hashes[i];
    let ch = challenges[hash];
    if(!ch.nonces || ch.nonces.length < 5) {
    
      let nonces = getState().nonces.byHash[hash];
      if(!nonces) {
        //log.info("Reading nonces from DB since not in state tree yet: ", hash);
        
          nonces = await Storage.instance.read({
            database: DBNames.NoncesByHash,
            key: hash.toLowerCase()
          });
          
          log.debug("DB lookup resolved", hash, "to", nonces.length, "nonces");
      }
      
      if(nonces.length > 0) {
        if(nonces.length > 5) {
          log.error("NONCES SHOULD NOT BE > 5", nonces.length);
          nonces = dedupeNonces(nonces);
          await Storage.instance.create({
            database: DBNames.NoncesByHash,
            key: hash.toLowerCase(),
            data: nonces
          });
        }
        ch = {
          ...ch,
          nonces
        };
      }
    }
    if(!ch.finalValue) {
      let value = getState().newValues.byHash[hash];
      if(!value) {
        value = await Storage.instance.read({
          database: DBNames.NewValue,
          key: hash
        });
        if(!value || value.length === 0) {
          log.warn("Could not resolve new value for challenge", hash);
        }  
      }
      
      ch = {
        ...ch,
        finalValue: value[0]
      }
    }
    challenges[hash] = ch;
  }
  let out = hashes.map(h=>challenges[h]);
  log.info("New challenges size", out.length)
  return out;
  //dispatch(Creators.updateChallenges(out));
  
}

const _addNonces = (nonces) => async (dispatch, getState) => {
  let challenges = {
    ...getState().challenges.byHash
  }
  
  //have to map by miner in case we see duplicate nonce events.
  let byHash = nonces.reduce((o,n)=>{
    let set= o[n.challengeHash] || [];
    set = [
      ...set,
      n
    ];
    set = dedupeNonces(set);
    o[n.challengeHash] = set;
    return o;
  },{});

  for(let i=0;i<nonces.length;++i) {
    let n = nonces[i];
    
    let ch = challenges[n.challengeHash];
    if(ch) {
      let set = byHash[n.challengeHash];
      if(set) {
        ch = {
          ...ch,
          nonces: set
        }
        challenges[ch.challengeHash] = ch;
      }
    }
  }
  dispatch(Creators.updateChallenges(Object.keys(challenges).map(k=>challenges[k])));
}

const _addValues = (values) => async (dispatch, getState) => {
  let challenges = {
    ...getState().challenges.byHash
  };
  for(let i=0;i<values.length;++i) {

    let nv = values[i];
    let newVal = nv.newValue;
    let miners = nv.miners;

    let ch = challenges[newVal.challengeHash];
    
    if(ch && !ch.finalValue) {
      
      ch = {
        ...ch,
        finalValue: newVal
      }

        /*
      let nonces = ch.nonces || [];
      if(nonces && nonces.length === 5) {
        let sorted = [];
        miners.forEach(m=>{
          for(let j=0;j<nonces.length;++j) {
            let n = nonces[j];
            if(n.miner === m) {
              sorted.push(n);
              break;
            }
          }
        });
        if(sorted.length > 0) {
          ch = {
            ...ch,
            nonces: sorted
          }
        }
      }
      */

      challenges[ch.challengeHash] = ch;
    }
  }
  dispatch(Creators.updateChallenges(Object.keys(challenges).map(k=>challenges[k])));
}

const findDisputedNonce = ({requestId, mineTime, miner}) => async (dispatch, getState) => {
  let key = ethUtils.sha3(""+requestId+""+mineTime);
  let ch = getState().challenges.byIdAndTime[key];
  if(ch && ch.nonces.length > 0) {
    for(let i=0;i<ch.nonces.length;++i) {
      let n = ch.nonces[i];
      if(n.miner === miner) {
        return n;
      }
    }
  }
  
  //long way to do it 
  /*
  let matchingHash = await Storage.instance.iterate({
    database: DBNames.NewValue,
    callback: (v) => {
      log.info("Checking mineTime", v.mineTime, "vs", mineTime, "id", v.id, "vs", requestId);
      if(v.mineTime == mineTime && v.id === requestId) {
        return v.challengeHash; //short-circuit once we find it
      }
    }
  });
  */
  let nv = await Storage.instance.readAll({
    database: DBNames.NewValue,
    filterFn: (v) => {
      if(v.id === requestId && v.mineTime === mineTime) {
        return true;
      }
      return false
    },
    limit: 1
  });

  log.info("Found matching value for dispute", nv);
  if(nv.length > 0) {
    nv = nv[0];
    ch = getState().challenges.byHash[nv.challengeHash];
    log.info("Matching challenge", ch);
    let nonces = ch?ch.nonces:null;
    if(!nonces) {
      log.info("No matching nonces, have to read from DB");
      nonces = await Storage.instance.read({
        database: DBNames.NoncesByHash,
        key: nv.challengeHash
      });
      log.info("Resulting read nonces", nonces);
    }
    
    log.info("Found target nonces to search", nonces);
    if(nonces && nonces.length > 0) {
      for(let i=0;i<nonces.length;++i) {
        let n = nonces[i];
        if(n.miner === miner) {
          return n;
        }
      }
    }
  }

  return null;

}

export default {
  init,
  addChallenges,
  setCurrentChallenge,
  findChallenge,
  findDisputedNonce,
  createChallenge,
  addNonceToChallenge,
  addValueToChallenge
}
