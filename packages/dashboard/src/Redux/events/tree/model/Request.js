import {Creators} from '../actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import Challenge from './Challenge';
//import {default as tipOps} from 'Redux/tips/operations';

import _ from 'lodash';


class Ops {
  constructor(props) {
    [
      'challengeEvent',
      'tipAddedEvent'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  challengeEvent(challenge) {
    return async (dispatch, getState) => {
      let ch = new Challenge({
        metadata: challenge
      });
      return dispatch(Creators.addChallenge(ch));
    }
  }

  tipAddedEvent(tip) {
    return async (dispatch,getState) => {

    }
  }
}

let ops = new Ops();

export default class RequestTree {

    static get ops() {
      return ops;
    }

   //-----------------------------------------------------------------------
     /**
      * Reads all stored requests and attaches challenges to the correct request
      * objects. This is called from Redux/events/operations during init.
      */
    static loadAll() {
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

        //returns a map of challenges keyed by request id
        let challenges = await dispatch(Challenge.loadAll(merged));
        _.keys(merged).forEach(k=>{
          let req = merged[k];
          let chMap = challenges[k];
          if(chMap) {
            req.challenges = chMap;
          }
        });
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
    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    })

    //mapping of challenges associated with the request keyed by challenge hash
    this.challenges = {};
  }
}
