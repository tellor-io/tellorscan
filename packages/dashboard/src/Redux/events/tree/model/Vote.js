import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';

export default class Vote {

  static _retrieveFromCache(disputesByHash) {
    return async (dispatch, getState) => {
      let user = getState().chain.chain.ethereumAccount.toLowerCase();
      console.log("User acct", user);
      let byId = {};
      await Storage.instance.iterate({
          database: dbNames.Voted,
          callback: (v, k, num) => {

            let votes = byId[v.id] || {
              userVoted: false,
              voteCount: 0
            };
            let val = v.agreesWithDisputer?1:-1;
            votes.userVoted = v.voter === user;
            console.log("Voter", v.voter);
            votes.voteCount += val;
            byId[v.id] = votes;
          }
      });
      return byId;
    }
  }



  static loadAll(missingBlocks, disputesByHash) {
    return async (dispatch, getState) => {
      let byId = await dispatch(Vote._retrieveFromCache(disputesByHash));
      return byId;
    }
  }

  constructor(props) {
    let meta = props.metadata;
    this.metadata = props.metadata;

    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    });
  }
}
