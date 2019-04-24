import Storage from 'Storage';
import _ from 'lodash';

export default class EventStorage {
  constructor() {
    this.id = "EventStorage";

    [
       'init',
       'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init() {
    return async (dispatch, getState) => {

    }
  }

  process({block}, next)  {
    return async (dispatch, getState) => {
      let txns = block.transactions;
      for(let i=0;i<txns.length;++i) {
        let txn = txns[i];
        let logs = txn.toStore || {};
        _.values(logs).forEach(log=>{
          console.log("Will store log", log);
        });
      }

      return next({block, txns});
    }
  }
}
