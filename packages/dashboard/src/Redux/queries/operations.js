import {Creators} from './actions';
import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import {default as reqOps} from 'Redux/events/requests/operations';

const init = () => async (dispatch,getState) => {
  dispatch(Creators.loadRequest());
  let state = getState();
  let con = state.chain.contract;

  

  //get the latest ids on qeueu in the contract
  let paypool = await con.payoutPool();
  //should be an array of 50 ids.
  let requests = [];
  paypool.forEach(reqId=>{
    let prom = dispatch(reqOps.lookup(reqId));
    requests.push(prom);
  });
  let results = await Promise.all(requests);

  dispatch(Creators.loadSuccess(results.filter(r=>r!==null)));
}

const select = (query) => (dispatch,getState) => {

  if(typeof query !== 'object') {
    query = getState().queries.byId[""+query];//in case of numeric id
    if(!query) {
      return;
    }
  }
  dispatch(Creators.selectQuery(query));
}

export default {
  init,
  select
}
