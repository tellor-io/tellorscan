import Plugin from './Plugin';
import * as dbNames from 'Storage/DBNames';
import {findRequestById} from 'Chain/utils';
import * as ethUtils from 'web3-utils';
import {Creators} from 'Redux/requests/actions';
import {default as miningOps} from 'Redux/analytics/mining/operations';

import _ from 'lodash';
import {
  normalizeRequest,
  normalizeChallenge
}  from './utils';

/**
 * Enrichment plugin that handles mining solution submissions and any
 * events that result from that fn call.
 */
export default class MiningSolutionHandler extends Plugin {
  constructor(props) {
    super({
      ...props,
      id: "MiningSolutionHandler",
      fnContexts: ['submitMiningSolution']
    });
    [
      'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  process(txn, store) {
    return async (dispatch, getState) => {

      let outData = {};
      //first, handle nonce submission changes
      await dispatch(handleNonces({txn, store, outData}));

      //then update nonce order if final value given
      let outOrdered = {};
      await dispatch(changeNonceOrder({txn, store, prevData: outData, outData: outOrdered}));
      if(outOrdered.challenge) {
        //if there are updates to the previous challenge, we need to
        //append those to the previous request
        let req = outData.request;
        req = {
          ...req,
          challenges: {
            ...req.challenges,
            [outOrdered.challenge.challengeHash]: outOrdered.challenge
          }
        }
        outData.request = req;
      }

      //at this point we can safely update redux with previous stuff
      dispatch(Creators.updateRequest({request: outData.request}));

      //then create new challenge if present in txn
      let outNew = {};
      await dispatch(addNewChallenge({txn, store, outPrev: outData, outData: outNew}));
      if(outNew.challenge) {
        //if we have a new challenge, make sure the new request gets updated
        dispatch(Creators.updateRequest({request: outNew.request}));

        //and set the current challenge to the new one
        dispatch(Creators.updateCurrent({challenge: outNew.challenge}));
      }
    }
  }
}

/**
 * Get the order of winning miners if available
 */
const getMiningOrder = newVal => async (dispatch, getState) => {
  let con = getState().chain.contract;
  if(!con) {
    return null;
  }
  newVal = newVal.normalize();
  //call on-chain to get miners by mining time and request id
  let miners = await con.getMinersByRequestIdAndTimestamp(newVal.id, newVal.mineTime);

  //make sure miner addresses are lower case for comparisons
  return miners.map(m=>m.toLowerCase());
}

/**
 * Find a request by its given id
 **/
const findRequest = ({txn, store, id}) => async (dispatch, getState) => {
  //see if already in redux store
  let byId = getState().requests.byId;
  let req = byId[id];
  if(!req) {
    //otherwise, find on-chain
    req = await dispatch(findRequestById(id));
    if(req) {
      //store it since we don't have it locally cached yet
      store({
        database: dbNames.DataRequested,
        key: ""+req.id,
        data: req.toJSON()
      });
      //setup any initial fields we'll use in dashboard
      req = normalizeRequest(req);
    }
  }
  return req;
}

/**
 * Handle incoming nonce submission events
 */
const handleNonces = ({txn, store, outData}) => async (dispatch, getState) => {
  let nonces = txn.logEventMap[dbNames.NonceSubmitted];
  if(!nonces) {
    return;
  }

  //I dont's think this is possible but just in case...treat as an array of submissions
  if(!Array.isArray(nonces)) {
    let a = [nonces];
    nonces = a;
  }
  if(nonces.length === 0){
    return;
  }
  //get the request associated with the submission
  let req = await dispatch(findRequest({id: nonces[0].id, txn, store}));
  if(!req) {
    return;
  }

  //find the challenge within that request associated with the submission
  let ch = req.challenges[nonces[0].challengeHash];
  if(!ch) {

    //there is no way to resolve the challenge if we don't know about it.
    //so we have to fabricate one.
    ch = {
      blockNumber: txn.blockNumber-1,//fake it out
      timestamp: txn.timestamp,
      finalValue: null,
      nonces: {},
      minerOrder: [],
      multiplier: req.multiplier,
      id: req.id,
      queryString: req.queryString,
      difficulty: 0,
      tip: 0,
      name: "NewChallenge"
    };
    //cache fabricated challenge so that we can recover its metadata later
    store({database: dbNames.NewChallenge,
      key: ch.challengeHash,
      data: ch
    });
  }

  ch = {
    ...ch,
    //update the challenge's nonce map with new nonces
    nonces: {
      ...ch.nonces,
      ...nonces.reduce((o,n)=>{
        //internallly keyed by miner address
        o[n.miner] = n;
        return o;
      },{})
    }
  };

  //store all nonces locally for later recovery
  nonces.forEach(n=>{
    store({
      database: dbNames.NonceSubmitted,
      key: ethUtils.sha3(n.challengeHash + n.miner),
      data: n.toJSON()
    });
  });

  //send challenge and updated request back to caller
  outData.challenge = ch;
  outData.request = {
    ...req,
    //update challenges because nonces have been added to the challenge
    challenges: {
      ...req.challenges,
      [ch.challengeHash]: ch
    }
  };
}

/**
 * Change the nonce sorting by attaching an winning order attribute to each
 * nonce, if we know the order
 */
const changeNonceOrder = ({txn, store, prevData, outData}) => async (dispatch, getState) => {
  //here we use the previously processed challenge because it's the version
  //that has the updated nonces attached to it.
  let challenge = prevData.challenge;
  let newVal = txn.logEventMap[dbNames.NewValue];
  if(!newVal) {
    return;
  }
  //remember that we've seen the new value locally for recovery
  store({
    database: dbNames.NewValue,
    key: newVal.challengeHash,
    data: newVal.toJSON()
  });

  //get the miners for the value's timeslot and request id
  let miners = await dispatch(getMiningOrder(newVal));
  if(miners && miners.length > 0) {
    //we assign a winning order to each nonce associated with the set
    let updated = _.values(challenge.nonces).map(n=>{
      //find the index of the nonce's miner address within the winning
      //miner addresses (which are sorted by winning position)
      let idx = miners.indexOf(n.miner);

      //flag the nonce with the correct winning order
      n.winningOrder = idx;

      //create a key that is unique for each nonce. Namely, a miner can never
      //submit multiple solutions for a challenge. So the combination of challenge
      //and miner address should be unique as a key
      let key = ethUtils.sha3(n.challengeHash + n.miner);

      //Record the updated nonce with its winning order idx
      store({database: dbNames.NonceSubmitted,
          key,
          data: {
            ...n.toJSON(),
            winningOrder: idx
          }
      });
      return n;
    });

    outData.miners = miners;
    //change the challenge to include the mining order
    //new value, and new nonces
    outData.challenge = {
      ...challenge,
      minerOrder: miners,
      finalValue: newVal,
      nonces: updated.reduce((o,n)=>{
        o[n.miner] = n;
        return o;
      },{})
    }

    //update the top miner redux store
    dispatch(miningOps.update(outData.challenge));
  }
}

/**
 * Add a new challenge if in the transaction logs
 */
const addNewChallenge = ({txn, store, outData}) => async (dispatch, getState) => {
  let ch = txn.logEventMap[dbNames.NewChallenge];
  if(!ch) {
    return;
  }
  //get the matching request in the redux store
  let req = getState().requests.byId[ch.id];
  if(!req) {
    //or try to find it on-chain
    req = await dispatch(findRequest({txn, store, id: ch.id}));
    if(!req) {
      return;
    }
  }

  //normalize the new challege with fields for dashboard
  ch = normalizeChallenge(req, ch);
  //update the request to include the new challenge
  outData.request = {
    ...req,
    currentTip: 0, //because any new challenge resets its tip
    challenges: {
      ...req.challenges,
      [ch.challengeHash]: ch
    }
  }
  //and remember we saw the challenge for future recovery
  store({database: dbNames.NewChallenge,
      key: ch.challengeHash,
      data: ch.toJSON()
  });
  outData.challenge = ch;
}
