import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import {Creators} from '../actions';
import eventFactory from 'Chain/LogEvents/EventFactory';
import {generateDisputeHash} from 'Chain/utils';
import Vote from './Vote';

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
    ].forEach(fn=>{
      if(!this[fn]) { throw new Error("Dispute missing fn: " + fn)}
      this[fn]=this[fn].bind(this);
    });
  }

  voteEvent(vote) {
    return async (dispatch,getState) => {
      let voteValue = vote.agreesWithDisputer?1:-1;
      let byId = getState().events.tree.byId;

      //TODO: once request id part of vote, we can find matching dispute easier
      let reqs = _.values(byId);
      let disp = null;
      for(let i=0;i<reqs.length;++i) {
        let r = reqs[i];
        let match = _.values(r.disputes).filter(d=>d.id===vote.id)[0];
        if(match) {
          disp = match;
          break;
        }
      }
      let user = getState().chain.chain.ethereumAccount;
      let userVoted = (user === vote.voter);
      if(disp) {
        disp = {
          ...disp,
          voteCount: disp.voteCount + voteValue,
          userVoted
        }
        dispatch(Creators.voteUpdated(disp));
      }
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
        let norm = d.normalize();
        let req = getState().events.tree.byId[norm.id];
        let disp = new Dispute({metadata: d, parent: req});
        dispatch(Creators.addDispute(disp));
        return disp;
      }
      return null;
    }
  }

  _lookupInState(hash) {
    return (dispatch, getState) => {
      let state = getState();
      let reqs = _.values(state.events.tree.byId);
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
        id = id.toString()-0;

        //get variables to recreate dispute metadata
        let vars = await con.getAllDisputeVars(id);
        /*
        hash,                     0
        executed,                 1
        disputeVotePassed,        2
        isPropFork,               3
        reportedMiner,            4
        reportingParty,           5
        proposedForkAddress,      6
        [requestId,               7.0
         timestamp,               7.1
         value,                   7.2
         minExecutionDate,        7.3
         numberOfVotes,           7.4
         blockNumber,             7.5
         minerSlot,               7.6
         quorum],                 7.7
         tally                    8
         */

        if(vars && vars[0] === hash) {

          let finalDate = vars[7][3].toString()-0;
          let submitDate = finalDate - (7*86400);
          let payload = {
            event: "NewDispute",
            timestamp: submitDate,
            returnValues: {
              _disputeId: id,
              _requestId: vars[7][0].toString()-0,
              _timestamp: vars[7][1].toString()-0,
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

  static _retrieveFromCache (reqById) {
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

      let disputes = _.values(byHash);
      let con = getState().chain.contract;
      for(let i=0;i<disputes.length;++i) {
        let d = disputes[i];
        let vars = await con.getAllDisputeVars(d.id);
        if(vars && vars[5]) {
          d.disputer = vars[5].toLowerCase();
        }
      }

      return {byId, byHash};
    }
  }

  static _storePastDispute(e) {
    return Storage.instance.create({
      database: dbNames.NewDispute,
      key: e.transactionHash,
      data: e
    });
  }

  static _readMissingDisputes ({gaps, byId, byHash}) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;
      let chain = getState().chain.chain;

      //we need to also get all past request events
      //that we might be missing
      gaps.forEach(async g=>{
        let evts = await con.getPastEvents("NewDispute", {
          fromBlock: g.start,
          toBlock: g.end
        });
        evts.forEach(async evt=>{
          let e = eventFactory(evt);
          if(e) {
            let ts = await chain.getTime(e.blockNumber);
            e.timestamp = ts;
            let norm = e.normalize();

            if(byHash[norm.disputeHash])  {
              return; //already know about it
            }
            await Dispute._storePastDispute(e.toJSON());
            let d = new Dispute({metadata: norm});
            let h = byId[norm.id] || {};
            h[d.disputeHash] = d;
            byId[norm.id] = h;
            byHash[norm.disputeHash] = d;
          }
        });
      });
    }
  }

  static loadAll(missingBlocks, reqById) {
    return async (dispatch, getState) => {
      let {byId,byHash} = await dispatch(Dispute._retrieveFromCache(reqById));

      let votesById = await dispatch(Vote.loadAll(missingBlocks, byHash));
      _.values(byHash).forEach(d=>{
        let voterInfo = votesById[d.id];
        if(voterInfo) {
          d.voteCount = voterInfo.voteCount;
          d.userVoted = voterInfo.userVoted;
        }
      });
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
      let match = _.values(props.parent.challenges).filter(c=>c.finalValue && c.finalValue.mineTime===this.mineTime)[0];
      if(match) {
        let nonce = findMatchingNonce(this, match);

        if(nonce) {
          this.value = nonce.value;
          this.minerIndex = nonce.winningOrder;
        } else {
          console.log("No matching nonce found", match.nonces);
        }
      } else {
        console.log("No matching challenge for dispute", props.parent.challenges);
      }
    } else {
      console.log("Disputed created without parent request");
    }
  }

  static get ops() {
    return ops;
  }

}
