import MiningHandler from './MiningSolutionHandler';
import RequestHandler from './RequestDataHandler';
import InitDispute from './InitDispute';
import VoteHandler from './VoteHandler';
import _ from 'lodash';

//by default, these are the sub-processors that will enrich the
//redux store as they process txns
const PLUGINS = [
  //used for adding tips or requests to store
  new RequestHandler(),

  //used for nonce-related activity
  new MiningHandler(),

  //used for disputes
  new InitDispute(),

  //used for votes
  new VoteHandler()
]

/**
 * Enrichment enriches the Redux store with state changes. Basically, it relies
 * on actions defined for the redux store to modify different parts of the tree
 * depending on what's going on in contract.
 */
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

      //for each plugin we want run to enrich redux store
      for(let i=0;i<PLUGINS.length;++i) {
        let p = PLUGINS[i];

        //see if the plugin requires initialization
        if(typeof p.init === 'function') {
          await dispatch(p.init());
        }

        //each plugin specifies the function context in which it's supposed
        //to run
        p.fnContexts.forEach(f=>{
          //we register the plugin with the given fn context
          let a = this.plugins[f] || [];

          //make sure we only add the plugin once
          let idx = _.findIndex(a, (pl)=>pl.id===p.id);
          if(idx >= 0) {
            throw new Error("Attempting to add plugin twice: " + p.id);
          }
          a.push(p);
          //associate list of plugins with function context
          this.plugins[f] = a;
        })
      }
    }
  }

  /**
   * Main process of event processing flow
   */
  process({block}, next, store) {
    return async (dispatch, getState) => {

      //for each txn in the block
      let txns = block.transactions;
      for(let i=0;i<txns.length;++i) {
        let txn = txns[i];

        //make sure we have logs to process and a known function context
        let logs = txn.logEvents;
        if(logs && txn.fn) {
          //get all plugins that registered to be called in the function context
          let procs = this.plugins[txn.fn];

          if(procs) {
            //for each plugin
            for(let j=0;j<procs.length;++j) {
              let p = procs[j];
              try {
                //ask it to process the transaction
                await dispatch(p.process(txn, store));
              } catch (e) {
                console.log("Problem processing txn with plugin", p.id, e);
              }
            }//end proc loop 
          }//end check for registered plugins for fn context
        }//end check for logs and fn context
      }//end plugin loop

      //after all plugins run, call next processor in event flow
      return next({block});
    }
  }
}
