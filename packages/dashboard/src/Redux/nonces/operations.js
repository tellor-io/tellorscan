import {Creators} from './actions';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import {Logger} from 'buidl-utils';

const log = new Logger({component: "NonceSubmittedOps"});

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  try {
    
    let r = await Storage.instance.readAll({
      database: DBNames.NonceSubmitted,
      sort: [
        {
          field: "blockNumber",
          order: "DESC"
        }
      ],
      limit: 250
    });
    
    dispatch(Creators.initSuccess(r));
    
   dispatch(Creators.initSuccess([]));
  } catch (e) {
    log.error("Problem initializing nonces", e);
    dispatch(Creators.failure(e));
  }
  
}

const addNonces = (nonces) => (dispatch) => {
  dispatch(Creators.addNonces(nonces));
}

export default {
  init,
  addNonces
}
