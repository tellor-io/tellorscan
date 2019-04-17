import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import Nonce from './Nonce';
import NewValue from './NewValue';
import {Creators} from '../actions';

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

  static loadAll(reqById) {
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


      //returns lists of nonces keyed by challenge hash
      let nonces = await dispatch(Nonce.loadAll(byHash));
      let minerOrder = [];
      _.keys(byHash).forEach(k=>{
        let nList = nonces[k];
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
      let values = await dispatch(NewValue.loadAll(byHash));

      _.keys(values).forEach(k=>{
        let val = values[k];
        let ch = byHash[k];
        if(ch) {
          ch.finalValue = val;
          ch.minerOrder = minerOrder;
        }
      });

      let latestBlock = await getState().chain.chain.latestBlock();
      _.keys(byId).forEach(k=>{
        let challengesByHash = byId[k];

        _.keys(challengesByHash).forEach(cHash=>{
          let ch = challengesByHash[cHash];

          if(!ch.finalValue && ch.blockNumber < latestBlock) {
            //FIXME: we need to pull events from the block of this challenge
            //and see if we missed something.
            delete challengesByHash[cHash];
          }
        })
      });

      //get the current one
      let current = getState().current.currentChallenge;
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
