import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';

export default class NewValue {

  static _retrieveFromCache(challengesByHash) {
    return async (dispatch, getState) => {
      let r = await Storage.instance.readAll({
        database: dbNames.NewValue,
        limit: 50,
        order: [{
          field: 'blockNumber',
          direction: 'desc'
        }]
      });
      let byHash = {};
      let values = r || [];
      values.forEach(v=>{
        byHash[v.challengeHash] = new NewValue({
          metadata: v
        })
      });
      return byHash;
    }
  }

  static _storePastValue(e) {
    return Storage.instance.create({
      database: dbNames.NewValue,
      key: e.transactionHash,
      data: e
    })
  }

  static _readMissingValues({gaps, valuesByHash}) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;
      //we need to also get all past request events
      //that we might be missing
      for(let i=0;i<gaps.length;++i) {
        let g = gaps[i];
        let evts = await con.getPastEvents("NewValue", {
          fromBlock: g.start,
          toBlock: g.end
        });
        for(let j=0;j<evts.length;++j) {
          let evt = evts[j];
          let e = eventFactory(evt);
          if(e) {
            let norm = e.normalize();
            if(valuesByHash[norm.challengeHash])  {
              return; //already know about it
            }
            await NewValue._storePastValue(e.toJSON());
            let n = new NewValue({
              metadata: norm
            });
            valuesByHash[n.challengeHash] = n;
          }
        }
      }
    }
  }

  static loadAll(missingBlocks, challengesByHash) {
    return async (dispatch,getState) => {
    //  console.log("Loading values from cache...");
      let byHash = await dispatch(NewValue._retrieveFromCache(challengesByHash));
    //  console.log("Read", _.keys(byHash).length);
    //  console.log("Reading missing values from chain...");
      await dispatch(NewValue._readMissingValues({gaps: missingBlocks, valuesByHash: byHash}));
    //  console.log("Now have", _.keys(byHash).length, "values");
      return byHash;
    }
  }

  constructor(props) {
    let meta = props.metadata;
    this.metadata = meta;
    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    });
  }
}
