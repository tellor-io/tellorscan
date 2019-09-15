import {Creators} from './actions';
import Chain, {init as chainInit} from 'Chain';
import {toastr} from 'react-redux-toastr';
import {generateQueryHash, generateDisputeHash, dedupeNonces, getMiningOrder} from 'Chain/utils';
import Storage from 'Storage';
import * as DBNames from 'Storage/DBNames';
import abi from 'Chain/abi';
import Factory from 'Chain/LogEvents/EventFactory';
import ETHHistory from 'eth-history';
import {
  Pipeline, 
  PollingDataSource,
  FilterAddressHandler,
  AddReceiptsHandler,
  ABIDecodeHandler
} from 'eth-pipeline';
import TipHandler from './handlers/TipHandler';
import InjectRedux from './handlers/InjectRedux';
import StorageHandler from './handlers/StorageHandler';
import FlushHandler from './handlers/FlushHandler';
import Helpers from './handlers/Helpers';
import LastBlockHandler from './handlers/LastBlockHandler';
import NewChallengeHandler from './handlers/NewChallengeHandler';
import NonceSubmitHandler from './handlers/NonceSubmitHandler';
import NewValueHandler from './handlers/NewValueHandler';
import {Logger} from 'buidl-utils';
import * as ethUtils from 'web3-utils';
import {Types as setTypes} from 'Redux/settings/actions';
import {default as reqOps} from 'Redux/newRequests/operations';
import {registerDeps} from 'Redux/DepMiddleware';
import _ from 'lodash';
import DisputeHandler from './handlers/DisputeHandler';

const MAX_BLOCKS = 8000;
const log = new Logger({component: "ChainOps"});

const init = () => async (dispatch,getState) => {
  if(getState().chain.chain) {
    return;
  }

  registerDeps([setTypes.TOGGLE_REALTIME], async ()=>{
    let pl = getState().chain.pipeline;
    let running = getState().settings.realtimeRunning;
    if(pl) {
      if(!running) {
        log.info("Stopping realtime event updates");
        await pl.stop();
      } else {
        log.info("Starting realtime event updates");
        await pl.start();
      }
    }
  });

  dispatch(Creators.loadRequest());
  //initialize the chain class
  chainInit();

  //create the chain instance
  let chain = Chain();
  try {
    //initialize the instance
    await dispatch(chain.init());

    //the prefix of the store are based on selected network
    await Storage.instance.init({
      dbPrefix: chain.network
    });

    let start = await _getLastBlockStored();
    log.info("Last stored block", start);

    let current = chain.block;
    let diff = current - start;
    if(diff > MAX_BLOCKS) {
      start = current - MAX_BLOCKS;
    }

    let eh = new ETHHistory({
      abi,
      web3: chain.web3, 
      targetAddress: chain.contract.address
    });

    let poller = new PollingDataSource({
      web3: chain.web3,
      interval: 5000,
      lastKnownBlock: start
    });
    let pipeline = new Pipeline({
      web3: chain.web3,
      blockSource: poller
    });
    //need to add redux (dispatch, getState) to ctx for downstream handlers
    pipeline.use(new InjectRedux({dispatch, getState}));

    //need to add aggregated storage to ctx for downstream handlers
    pipeline.use(new StorageHandler());

    //need to install filter address handler (thus need 'to' address in each txn)
    pipeline.use(new FilterAddressHandler(chain.contract.address));
    
    //need to install receipt handler (for abi decoding but only if logEvents missing in txn)
    pipeline.use(new AddReceiptsHandler());

    //need to install abi handler (should only process if logEvents not in txn)
    pipeline.use(new ABIDecodeHandler(abi));

    //install helper functions for our handlers 
    pipeline.use(new Helpers());

    //need to install various event type handlers (Tip, DataRequest, NonceSubmitted, etc)
    pipeline.use(new TipHandler());
    pipeline.use(new NonceSubmitHandler());
    pipeline.use(new NewValueHandler());
    pipeline.use(new NewChallengeHandler());
    pipeline.use(new DisputeHandler());
    
    //record the last block we've seen for next time
    pipeline.use(new LastBlockHandler());
  
    //need final handler that will update redux with final data and create bulk storage request for persisted items
    pipeline.use(new FlushHandler());

    //first, initialize the pipeline
    await pipeline.init();

    await dispatch(_initAllEvents({
      ethHistory: eh,
      fromBlock: start,
      toBlock: current,
      contract: chain.contract
    }));

    //set it on the redux store
    dispatch(Creators.loadSuccess(chain, pipeline, eh));

    //initialize the eth processing flow
    //await dispatch(ethProcs.init());

  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

/**
 * Startup the flow and any subscriptions
 */
const startSubscriptions = () => async (dispatch,getState) => {
  try {

    
    let pipeline = getState().chain.pipeline;
    if(pipeline) {
      let block = await _getLastBlockStored();
      if(!block) {
        block = await getState().chain.chain.web3.eth.getBlockNumber();
        block -= 1;
      }
    
      log.info("Starting block subscription from block", block);
      pipeline.blockSource.lastBlock = block?block:undefined;
      await pipeline.start();
    }
    
    
  } catch (e) {
    console.log("Could not start eht processors", e);
  }
}



/**
 * Not guaranteed to be called but is supposed to cleanup
 * any subscriptions
 */
const unload = () => async (dispatch, getState) => {
    let chain = getState().chain.chain;
    await chain.unload();
    let pipeline = getState().chain.pipeline;
    if(pipeline) {
      await pipeline.stop();
    }
}


const lookupQueryByHash = props => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  let hash = generateQueryHash(props.queryString, props.multiplier);
  let ex = await con.getRequestIdByQueryHash(hash);
  if(ex && ex.toString) {
    ex = ex.toString()-0;
  }
  return ex || 0;
}

const lookupDisputeByHash = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  let hash = generateDisputeHash({miner: props.miner.address, requestId: props.requestId, timestamp: props.timestamp});
  let ex = await con.getDisputeIdByDisputeHash(hash);
  if(ex && ex.toString) {
    ex = ex.toString()-0;
  }
  return ex || 0;
}

/**
 * Calls the contract's requestData method after verifying
 * that the request doesn't already exist
 */
const requestData = props => async (dispatch,getState) => {
  let ex = await dispatch(lookupQueryByHash(props));
  if(ex) {
    throw new Error("Query already exists with id: " + ex);
  }
  return dispatch(_doRequestData(props));
}

/**
 * Calls beginDispute after verifying that the dispute doesn't
 * already exist
 */
const initDispute = props => async (dispatch, getState) => {
  let ex = await dispatch(lookupDisputeByHash(props));
  if(ex) {
    toastr.error("Error", "Dispute already active for miner,requestId,timestamp combination");
  } else {
    await dispatch(_doInitDispute(props));
  }
}

const _doRequestData = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  //call on-chain to request data
  await con.requestData(props.queryString, props.symbol, props.multiplier, props.tip)
    .then(()=>{
      return toastr.info("Submitted data request");
    }).catch(e=>{
      toastr.error("Error", e.message);
      throw e;
    });
}

const _doInitDispute = props => async (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  //call on-chain to begin a new dispute
  if(typeof props.miner.index === 'undefined' || props.miner.index < 0) {
    let order = await dispatch(getMiningOrder({id: props.requestId, mineTime: props.timestamp}));
    if(!order) {
      toastr.error("Could not determine mining index for dispute");
      throw new Error("Cannot determine mining order to dispute");
    }
    order.forEach((m,i)=>{
      if(m === props.miner.address) {
        props.miner.index = i;
      }
    });
  }
  if(props.miner.index < 0) {
    toastr.error("Could not determine proper mining index to dispute");
    throw new Error("Cannot determine mining order to dispute");
  }

  await con.beginDispute(props.requestId, props.timestamp, props.miner.index)
    .then(()=>{
      return toastr.info("Submitted dispute request");
    }).catch(e=>{
      toastr.error("Error", e.message);
      throw e;
    })
}

/**
 * Calls contract's addTip function
 */
const addToTip = (id,tip) => (dispatch, getState) => {
  let state = getState();
  let req = state.newRequests.byId[id];
  if(req) {
    let con = state.chain.contract;
    return con.addTip(req.id, tip);
  }
  
}

/**
 * Calls contract's lazyCoon function to get tokens
 */
const getTokens = (addr) => (dispatch, getState) => {
  let state = getState();
  let con = state.chain.contract;
  return con.getTokens(addr);
}

const _getLastBlockStored = async () => {
  let r = await Storage.instance.readAll({
    database: DBNames.LastBlock,
    limit: 1,
    sort: [
      {
        field: "blockNumber",
        order: 'DESC'
      }
    ]
  });
  return r[0]?r[0].blockNumber:0;
}

const _initAllEvents = (props) => async (dispatch, getState) => {
  const {
    ethHistory,
    fromBlock,
    toBlock,
    contract
  } = props;

  log.info("Scanning history in range", fromBlock, toBlock);

  let mappedEvents = {};
    let metadata = {};
    await ethHistory.recoverEvents({
      fromBlock,
      toBlock
    }, async (e, evts)=>{
      if(e) {
        log.err("Problem getting events", e);
        return;
      } 
      if(!evts || evts.length === 0) {
        return;
      }
        
      for(let i=0;i<evts.length;++i) {
        let txn = evts[i];

        let logEvents = txn.logEvents;
        Object.keys(DBNames).forEach(nm=>{
          let logs = logEvents[nm];
          let asEvent = [];
          if(logs && logs.length > 0) {
            logs.forEach(l=>{
              
              let evt = Factory({
                event: nm,
                ...l
              });
              if(evt) {
                asEvent.push(evt); 
                let reqId = evt.id || evt.requestId;
                if(reqId) {
                  let reqs = metadata[DBNames.DataRequested] || [];
                  reqs.push(reqId);
                  reqs = _.uniq(reqs);
                  metadata[DBNames.DataRequested] = reqs;
                }
              }
            });
            if(asEvent.length > 0) {
              let a = mappedEvents[nm] || [];
              a = [
                ...a,
                ...asEvent
              ];
              mappedEvents[nm] = a;
            }
            
          }
        })
      }
      
    }).then(async ()=>{

      //have to resolve all ref'd IDs
      let ids = metadata[DBNames.DataRequested] || [];
      let byId = getState().newRequests.byId;
      for(let i=0;i<ids.length;++i) {
        let id = ids[i];
        let req = byId[id];
        if(!req) {
          req = await dispatch(reqOps.findRequestById(id, contract));
          if(!req) {
            log.error("Could not resolve request", id);
          }
        }
      }
      
      let newChallenges = mappedEvents[DBNames.NewChallenge] || [];
      let nonces = mappedEvents[DBNames.NonceSubmitted] || [];
      let values = mappedEvents[DBNames.NewValue] || [];
      let tips = mappedEvents[DBNames.TipAdded] || [];
      let disputes = mappedEvents[DBNames.NewDispute] || [];
      
      let newChallengeStorage = newChallenges.map(ch=>{
        return {
          key: ch.challengeHash,
          value: ch.toJSON()
        }
      });

      let tipStorage = tips.map(t=>{
        return {
          key: t.transactionHash,
          value: t.toJSON()
        }
      });
      
      let noncesByHash = {};
      let nonceStorage = nonces.map((n)=>{
        let b4 = noncesByHash[n.challengeHash] || [];
        b4.push(n);
        let a = dedupeNonces(b4);
        noncesByHash[n.challengeHash] = a;
        return {
          key: ethUtils.sha3(n.challengeHash + n.miner),
          value: n.toJSON()
        };
      });
      
      let newValueStorage = [];
      for(let i=0;i<values.length;++i) {
        let v = values[i];
        newValueStorage.push({
          key: v.challengeHash,
          value: v.toJSON()
        });
      };

      let noncesByHashStorage = Object.keys(noncesByHash).map(hash=>{
        let matches = noncesByHash[hash];
        if(!matches || matches.length == 0) {
          throw new Error("Found hash but no matching nonces", hash);
        }
        let newNonces = matches.map(n=>n.toJSON());
        return {
          key: hash,
          value: newNonces
        }
      });

      let disputeStorage = disputes.map(d=>({
        key: d.id,
        value: d.toJSON()
      }));

      if(newChallengeStorage.length > 0) {
        await _storeItems(DBNames.NewChallenge, newChallengeStorage);
      }

      if(nonceStorage.length > 0) {
        await _storeItems(DBNames.NonceSubmitted, nonceStorage);
      }

      if(noncesByHashStorage.length > 0) {
        for(let i=0;i<noncesByHashStorage.length;++i) {
          let item = noncesByHashStorage[i];
        
          let existing = await Storage.instance.read({
            database: DBNames.NoncesByHash,
            key: item.key
          });
          if(!existing) {
            existing = [];
          }
          let merged = [
            ...item.value,
            ...existing
          ];
          merged = dedupeNonces(merged);
          noncesByHashStorage[i] = {
            key: item.key,
            value: merged
          };
        }
        await _storeItems(DBNames.NoncesByHash, noncesByHashStorage, true);
      }

      if(newValueStorage.length > 0) {
        await _storeItems(DBNames.NewValue, newValueStorage);
      }

      if(tipStorage.length > 0) {
        await _storeItems(DBNames.TipAdded, tipStorage);
      }

      if(disputeStorage.length > 0) {
        await _storeItems(DBNames.NewDispute, disputeStorage);
      }

      if(toBlock > 0) {
        log.info("Storing high-block", toBlock);
        await Storage.instance.create({
          database: DBNames.LastBlock,
          key: "last",
          data: {
            blockNumber: toBlock,
            timestamp: Date.now() //never used
          }
        });
      }

    }).catch(e=>{
      console.log("Problem synching history", e);
    })
}


const _storeItems = async (db, items, asList) => {
  let s = Date.now();
  log.info("Storing items in", db,'...');
  if(asList) {
    await Storage.instance.appendToList({
      database: db,
      items
    })
  } else {
    await Storage.instance.createBulk({
      database: db, 
      items
    });
  }
  log.info("Finished storing",items.length,"items in", (Date.now()-s), "ms");
}

export default {
  init,
  unload,
  startSubscriptions,
  requestData,
  addToTip,
  lookupQueryByHash,
  lookupDisputeByHash,
  initDispute,
  getTokens
}
