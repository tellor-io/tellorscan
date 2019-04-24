
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

    }
  }

  process({block}, next) {
    return async (dispatch, getState) => {
      let con = getState().chain.contract;

      let txns = block.transactions;
      txns.forEach(t=>{
        let logs = t.logEvents;
        if(logs && logs.length > 0) {
          con.emitEvents({context: t.fn, logs});
        }
      })
      return next({block});
    }
  }
}
