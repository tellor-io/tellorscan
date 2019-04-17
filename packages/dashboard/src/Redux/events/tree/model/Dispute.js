import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {Creators} from '../actions';
import eventFactory from 'Chain/LogEvents/EventFactory';

const VOTABLE_PERIOD = 7 * 86400; //7 days to vote

class Ops {
  constructor() {
    [
      'voteEvent',
      'tallyEvent',
      'findByDisputeHash',
      '_lookupInState',
      '_lookupInStorage',
      '_lookupOnChain'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  voteEvent(nonce) {
    return async (dispatch,getState) => {

    }
  }

  tallyEvent(value) {
    return async (dispatch, getState) => {

    }
  }

  findByDisputeHash(hash) {
    return async (dispatch, getState) => {
      let d = dispatch(this._lookupInState(hash));
      if(d) {
        return d;
      }
      d = await dispatch(this._lookupInStorage(hash));
      if(d) {
        let disp = new Dispute({metadata: d});
        dispatch(Creators.addDispute(disp));
        return disp;
      }

      d = await dispatch(this._lookupOnChain(hash));
      if(d) {
        let disp = new Dispute({metadata: d});
        dispatch(Creators.addDispute(disp));
        return disp;
      }
      return null;
    }
  }

  _lookupInState(hash) {
    return (dispatch, getState) => {
      let state = getState();
      let reqs = _.values(state.event.tree.byId);
      for(let i=0;i<reqs.length;++i) {
        let r = reqs[i];
        let d = r.disputes[hash];
        if(d) {
          return d;
        }
      }
      return null;
    }
  }

  _lookupInStorage (hash) {
    return async (dispatch, getState) => {
      let r = await Storage.instance.find({
        database: dbNames.NewDispute,
        selector: {
          disputeHash: hash
        },
        limit: 1
      });
      let d = r[0];
      if(d) {
        return d;
      }
      return null;
    }
  }

  _lookupOnChain(hash) {
    return async (dispatch, getState) => {
      let state = getState();
      let con = state.chain.contract;
      let id = await con.getDisputeIdByDisputeHash(hash);
      if(id) {
        //get variables to recreate dispute metadata
        let vars = await con.getDisputeById(id);
        if(vars && vars.length > 0) {
          /*
          d.hash,                   0
          d.executed,               1
          d.disputeVotePassed,      2
          d.isPropFork,             3
          d.reportedMiner,          4
          d.reportingParty,         5
          d.proposedForkAddress,    6
          d.apiId,                  7
          d.timestamp,              8
          d.value,                  9
          d.minExecutionDate,       10
          d.numberOfVotes,          11
          d.minerSlot,              12
          d.tally                   13
          */
          let finalDate = vars[10];
          let submitDate = finalDate - (7*86400);
          let payload = {
            event: "NewDispute",
            timestamp: submitDate,
            returnValues: {
              _DisputeID: id,
              _apiId: vars[7],
              _timestamp: vars[8],
              _challengeHash: null, //get this later
              _disputeHash: vars[0],
              _miner: vars[4]
            }
          };
          let evt = eventFactory(payload);
          await Storage.instance.create({
            database: dbNames.NewDispute,
            key: hash,
            data: evt.toJSON()
          });
          return evt.normalize();
        }
      }
      return null;
    }
  }
}

let ops = new Ops();

const findMatchingNonce = (disp, challenge) => {
  if(!challenge) {
    return null;
  }
  return challenge.nonces.filter(n=>n.miner === disp.miner)[0];
}

export default class Dispute {

  static loadAll(reqById) {
    return async (dispatch, getState) => {
      let r = await Storage.instance.readAll({
        database: dbNames.NewDispute,
        limit: 50,
        order: [{
          field: 'blockNumber',
          direction: 'desc'
        }]
      });

      let byId = {}
      let byHash = r.reduce((o,d)=>{
        let req = reqById[d.requestId];
        if(!req) {
          console.log("No dispute parent request found with id", d.requestId);
          return o;
        }
        let disp = new Dispute({
          metadata: d,
          parent: req
        });

        if(Dispute.canVote(disp)) {
          o[d.disputeHash] = disp;
          let h = byId[d.requestId] || {};
          h[d.disputeHash] = disp;
          byId[d.requestId] = h;
        }

        return o;
      },{});

      //TODO: load all open disputes from contract

      return byId;
    }
  }

  static canVote(dispute) {
    if(dispute.finalTally) {
      return false;
    }
    let diff = Dispute.timeRemaining(dispute);
    return diff > 0;
  }

  static timeRemaining(dispute) {
    let now = Math.floor(Date.now()/1000);
    let end = dispute.timestamp || 0;
    return VOTABLE_PERIOD - (now - end);
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

    this.value = this.value || 0;
    this.voteCount = this.voteCount || 0;
    this.finalTally =this.finalTally || null;
    if(props.parent) {
      let ch = props.parent.challenges[this.challengeHash];
      let nonce = findMatchingNonce(this, ch);
      if(nonce) {
        this.value = nonce.value;
      }
    }
  }

  static get ops() {
    return ops;
  }

}
