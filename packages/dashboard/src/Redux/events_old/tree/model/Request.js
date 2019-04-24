import {Creators} from '../actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import Challenge from './Challenge';
import Dispute from './Dispute';
import eventFactory from 'Chain/LogEvents/EventFactory';

import _ from 'lodash';


class Ops {
  constructor(props) {
    [
      'challengeEvent',
      'disputeEvent'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  challengeEvent(challenge) {

    return async (dispatch, getState) => {
      if(!challenge) {
        return;
      }
      let req = getState().events.tree.byId[challenge.id];
      let ch = new Challenge({
        metadata: challenge,
        parent: req
      });
      return dispatch(Creators.addChallenge(ch));
    }
  }

  disputeEvent(dispute) {
    return async (dispatch, getState) => {
      if(!dispute) {
        return;
      }
      let req = getState().events.tree.byId[dispute.requestId];
      let d = new Dispute({
        metadata: dispute,
        parent: req
      });
      return dispatch(Creators.addDispute(d));
    }
  }

}

let ops = new Ops();

export default class RequestTree {

    static get ops() {
      return ops;
    }

    static _retrieveFromCache () {
      return async (dispatch, getState) => {
        let r = await Storage.instance.readAll({
          database: dbNames.DataRequested,
          limit: 50,
          order: [{
            field: 'blockNumber',
            direction: 'desc'
          }]
        });
        let events = r || [];
        r = await Storage.instance.readAll({
          database: dbNames.RequestMetadata,
          limit: 50
        });
        let shells = r || [];
        let merged = {
          ...shells.reduce((o,e)=>{
            o[e.id] = new RequestTree({metadata: e});
            return o;
          },{}),
          ...events.reduce((o,e)=>{
            o[e.id] = new RequestTree({metadata: e});
            return o;
          },{}),
        };
        return merged;
      }
    }

    static _storePastRequest(e) {
      return Storage.instance.create({
        database: dbNames.DataRequested,
        key: e.transactionHash,
        data: e
      });
    }

    static _readMissingRequests (gaps, merged) {
      return async (dispatch, getState) => {
        let chain = getState().chain.chain;
        let con = getState().chain.contract;

        //we need to also get all past request events
        //that we might be missing
        for(let i=0;i<gaps.length;++i) {
          let g = gaps[i];
          let evts = await con.getPastEvents("DataRequested", {
            fromBlock: g.start,
            toBlock: g.end
          });
          for(let j=0;j<evts.length;++j) {
            let evt = evts[j];
            let e = eventFactory(evt);
            if(e) {
              let ts = await chain.getTime(e.blockNumber);
              e.timestamp = ts;
              let norm = e.normalize();
              if(merged[norm.id])  {
                continue; //already know about it
              }
              await RequestTree._storePastRequest(e.toJSON());
              let tree = new RequestTree({metadata: norm});
              merged[norm.id] = tree;
            }
          }
        }
      }
    }

   //-----------------------------------------------------------------------
     /**
      * Reads all stored requests and attaches challenges to the correct request
      * objects. This is called from Redux/events/operations during init.
      */
    static loadAll(missingBlocks) {
      return async (dispatch, getState) => {
        //get from local cache
      //  console.log("Getting cached requests...");
        let merged = await dispatch(RequestTree._retrieveFromCache());
      //  console.log("Retrieved", _.keys(merged).length, "requests");

        //read any missing items from chain (cache them locally)
      //  console.log("Reading past requests from chain...");
      //  await dispatch(RequestTree._readMissingRequests(missingBlocks, merged));
      //  console.log("Total requests", _.keys(merged).length);

        //get a map of all challenges keyed by request id
      //  console.log("Loading all challenges...");
        let challenges = await dispatch(Challenge.loadAll(missingBlocks, merged));
      //  console.log("Loaded challenges", challenges);

        //have to first merge in all challenges since they are
        //referenced by disputes below
        _.keys(merged).forEach(k=>{
          let req = merged[k];
          let chMap = challenges[k];
          if(chMap) {
            req.challenges = chMap;
          }
        });

      //  console.log("Loading disputes...");
        let disputes = await dispatch(Dispute.loadAll(missingBlocks, merged));
      //  console.log("Loaded disputes", disputes);
        _.keys(merged).forEach(k=>{
          let req = merged[k];
          let dMap = disputes[k];
          if(dMap) {
            req.disputes = dMap;
          }
        });
      //  console.log("Done loading all requests");
        return merged;
      }
    }
   //-----------------------------------------------------------------------

   /**
    * Request tree instance that just represents what state is held in
    * redux state store
   */
  constructor(props) {

    //copy all event properties (not functions) to this instance for
    //consistency.
    let meta = props.metadata;
    this.metadata = props.metadata;
    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    });

    //mapping of challenges associated with the request keyed by challenge hash
    this.challenges = {};

    //mapping of all disputes by dispute Id
    this.disputes = {};
  }
}
