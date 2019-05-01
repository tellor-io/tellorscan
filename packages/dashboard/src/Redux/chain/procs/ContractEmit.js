
/**
 * The purpose of this processor is to group all log events for
 * transactions and emit as blockEvents in the context of the
 * contract function that was called
 */
export default class ContractEmit {
  constructor() {
    this.id = "ContractEmit";
    [
      'init',
      'process'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  init() {
    return async (dispatch,getState) => {
      //no-op
    }
  }

  process({block}, next) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;

      //get block's transactions
      let txns = block.transactions;

      //for each txn
      txns.forEach(t=>{

        //grab its logs
        let logs = t.logEvents;

        //if it has logs
        if(logs && logs.length > 0) {
          //have contract emit the events in the given context
          con.emitEvents({context: t.fn, logs});
        }
      })
      //then go to next processor
      return next({block});
    }
  }
}
