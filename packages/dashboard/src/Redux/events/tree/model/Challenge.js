import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import Nonce from './Nonce';
import NewValue from './NewValue';
import {Creators} from '../actions';
import eventFactory from 'Chain/LogEvents/EventFactory';

const DISPUTABLE_PERIOD = 86400; //1 day in seconds
const VOTABLE_PERIOD = 7 * 86400; //7 days to vote

class Ops {
  constructor() {
    [
      'nonceEvent',
      'newValueEvent'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  nonceEvent(nonce) {
    return async (dispatch,getState) => {
      let state = getState();
      let req = state.events.tree.byId[nonce.id];
      let ch = req.challenges[nonce.challengeHash];
      let minerOrder = ch.minerOrder;
      let idx = minerOrder.indexOf(nonce.miner);
      nonce = new Nonce({
        metadata: nonce
      });
      if(idx >= 0) {
        nonce.winningOrder = idx;
        await dispatch(Nonce.ops.save(nonce));
      };
      dispatch(Creators.addNonce(nonce))
    }
  }

  newValueEvent(value) {
    return async (dispatch, getState) => {
      let state = getState();
      let con = state.chain.contract;
      let miners = await con.getMinersByRequestIdAndTimestamp(value.id, value.mineTime);
      if(!miners) {
        miners = ch.nonces.map(n=>n.miner);
      }
      let req = state.events.tree.byId[value.id];
      let ch = req.challenges[value.challengeHash];

      ch.nonces.forEach(async n=>{
        let idx = miners.indexOf(n.miner);
        if(idx >= 0) {
          n = {
            ...n,
            winningOrder: idx
          };
          await dispatch(Nonce.ops.save(n));
          dispatch(Creators.nonceUpdated(n));
        }
      });
      ch.nonces.sort((a,b)=>a.winningOrder-b.winningOrder);
      dispatch(Creators.addNewValue(value, miners));
    }
  }
}

let ops = new Ops();

export default class Challenge {

  static _retrieveFromCache(reqById) {
    return async (dispatch, getState) => {
      let r = await Storage.instance.readAll({
        database: dbNames.NewChallenge,
        limit: 50,
        order: [{
          field: 'blockNumber',
          direction: 'desc'
        }]
      });

      let byId = {}
      let byHash = r.reduce((o,c)=>{
        let req = reqById[c.id];
        let ch = new Challenge({
          metadata: c,
          parent: req
        });
        o[c.challengeHash] = ch;
        let h = byId[c.id] || {};
        h[c.challengeHash] = ch;
        byId[c.id] = h;
        return o;
      },{});
      return {byId, byHash};
    }
  }

  static _storePastChallenge(e) {
    return Storage.instance.create({
      database: dbNames.NewChallenge,
      key: e.transactionHash,
      data: e
    })
  }

  static _readMissingChallenges({gaps, reqById, byHash, byId}) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;
      //we need to also get all past request events
      //that we might be missing
      for(let i=0;i<gaps.length;++i) {
        let g = gaps[i];
        let evts = await con.getPastEvents("NewChallenge", {
          fromBlock: g.start,
          toBlock: g.end
        });
        for(let j=0;j<evts.length;++j) {
          let evt = evts[j];
          let e = eventFactory(evt);
          if(e) {
            let norm = e.normalize();
            if(byHash[norm.challengeHash]) {
              continue; //already have it
            }

            await Challenge._storePastChallenge(e.toJSON());
            let ch = new Challenge({
              metadata: norm,
              parent: req
            });
            let req = reqById[ch.id];
            let h = byId[ch.id] || {};
            h[ch.challengeHash] = ch;
            byId[ch.id] = h;
            byHash[ch.challengeHash] = ch;
          }
        }
      }
    }
  }

  static readCurrentChallenge() {
    return async (dispatch, getState) => {
      let currentInfo = null;
      let con = getState().chain.contract;
      try {
        currentInfo = await con.getCurrentVariables();
      } catch (e) {
        //possible that contract isn't deployed yet or is unreachable
        //for whatever reason.
      }

      let evt = null;
      if(currentInfo) {

        let payload = {
          event: "NewChallenge",
          returnValues: {
            _currentChallenge: currentInfo[0],
            _currentRequestId: currentInfo[1],
            _difficulty: currentInfo[2],
            _query: currentInfo[3],
            _multiplier: currentInfo[4]
          }
        };
        evt = eventFactory(payload);
        evt = evt.normalize();
        return evt;
      }
      return null;
    }
  }

  static _readMiningOrder(id, ts) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;
      let r = await con.getMinersByRequestIdAndTimestamp(id, ts);
      return r;
    }
  }

  static loadAll(missingBlocks, reqById) {
    return async (dispatch, getState) => {
    //  console.log("Reading challenges by cache...");
      let {byId, byHash} = await dispatch(Challenge._retrieveFromCache(reqById));
    //  console.log("Read ", _.keys(byHash).length);
    //  console.log("Reading missing challenges from chain...");
      await dispatch(Challenge._readMissingChallenges({gaps: missingBlocks, reqById, byId, byHash}));
    //  console.log("Now have", _.keys(byHash).length, "challenges");

      //returns lists of nonces keyed by challenge hash
    //  console.log("Reading nonces...");
      let nonces = await dispatch(Nonce.loadAll(missingBlocks, byHash));
    //  console.log("Read nonces", nonces);
      let minerOrder = [];
      _.keys(byHash).forEach(k=>{
        let nList = nonces[k];
        if(!nList) {
          return;
        }
        let ch = byHash[k];
        if(ch) {
          ch.nonces = nList;
          nList.forEach(n=>{
            if(n.winningOrder >= 0) {
              minerOrder[n.winningOrder] = n.miner;
            }
          })
          ch.nonces.sort((a,b)=>a.winningOrder-b.winningOrder);
        }
      });


      //returns individual new value items keyed by challenge hash
    //  console.log("Reading values...");
      let values = await dispatch(NewValue.loadAll(missingBlocks, byHash));
    //  console.log("Read values", values);

      let valKeys = _.keys(values);
      for(let i=0;i<valKeys.length;++i) {
        let k = valKeys[i];
        let val = values[k];
        let ch = byHash[k];
        if(ch) {
          ch.finalValue = val;
          let miners = minerOrder;
          if(minerOrder.length === 0) {
            miners = await dispatch(Challenge._readMiningOrder(ch.id, val.mineTime));
            let nonces = ch.nonces || [];

            for(let j=0;j<nonces.length;++j) {
              let n = nonces[j];
              let newNonce = {
                ...n,
                winningOrder: miners.indexOf(n.miner)
              };
              await dispatch(newNonce.save());
              return newNonce;
            }
            nonces.sort((a,b)=>a.winningOrder-b.winningOrder);
          }
          ch.minerOrder = miners;
        }
      }

      //get the current one
    //  console.log("Getting current");
      let current = await dispatch(Challenge.readCurrentChallenge());
    //  console.log("Read current", current);
      if(current) {
        let byHashMap = byId[current.id] || {};
        byHashMap[current.challengeHash] = new Challenge({metadata: current});
        byId[current.id] = byHashMap;
      }

      return byId;
    }
  }

  static isDisputable(challenge) {
    if(!challenge.finalValue) {
      return true;
    }
    let diff = Challenge.timeRemaining(challenge);
    return diff > 0;
  }

  static timeRemaining(challenge) {
    let now = Math.floor(Date.now()/1000);
    let end = challenge.finalValue?challenge.finalValue.mineTime:0;
    return DISPUTABLE_PERIOD - (now - end);
  }

  constructor(props) {
    let meta = props.metadata;
    this.metdata = meta;
    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    })
    if(props.parent) {
      this.symbol = props.parent.symbol;
    }
    this.nonces = [];
    this.finalValue = null;
    this.minerOrder = [];
    [
      'isDisputable',
      'timeRemaining'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  timeRemaining(challenge) {
    let now = Math.floor(Date.now()/1000);
    let end = challenge.finalValue?challenge.finalValue.mineTime:0;
    return DISPUTABLE_PERIOD - (now - end);
  }

  isDisputable(challenge) {
    if(!this.finalValue) {
      return true;
    }
    let diff = this.timeRemaining(challenge);
    return diff > 0;
  }



  static get ops() {
    return ops;
  }

}
