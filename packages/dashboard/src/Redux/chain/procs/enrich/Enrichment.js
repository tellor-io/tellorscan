import eventFactory from 'Chain/LogEvents/EventFactory';
import MiningHandler from './MiningSolutionHandler';
import RequestHandler from './RequestDataHandler';
import InitDispute from './InitDispute';
import VoteHandler from './VoteHandler';
import _ from 'lodash';

const PLUGINS = [
  new RequestHandler(),
  new MiningHandler(),
  new InitDispute(),
  new VoteHandler()
]

export default class Enrichment {
  constructor(props) {
    this.id = "Enrichment";
    this.plugins = {};
    [
      'init',
      'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init() {
    return async (dispatch, getState) => {

      for(let i=0;i<PLUGINS.length;++i) {
        let p = PLUGINS[i];
        if(typeof p.init === 'function') {
          await dispatch(p.init());
        }
        p.fnContexts.forEach(f=>{
          let a = this.plugins[f] || [];
          let idx = _.findIndex(a, (pl)=>pl.id===p.id);
          if(idx >= 0) {
            throw new Error("Attempting to add plugin twice: " + p.id);
          }
          a.push(p);
          this.plugins[f] = a;
        })
      }
    }
  }

  process({block}, next, store) {
    return async (dispatch, getState) => {

      let txns = block.transactions;
      for(let i=0;i<txns.length;++i) {
        let txn = txns[i];
        let logs = txn.logEvents;
        if(logs && txn.fn) {
          let procs = this.plugins[txn.fn];
          console.log("fn,procs", txn.fn, procs);
          if(procs) {
            for(let j=0;j<procs.length;++j) {
              let p = procs[j];
              try {
                await dispatch(p.process(txn, store));
              } catch (e) {
                console.log("Problem processing txn with plugin", p.id, e);
              }
            }
          }
        }
      }

      return next({block});
    }
  }
}
