import {Creators} from './actions';
import eventFactory from 'Chain/LogEvents/EventFactory';
import {default as reqOps} from 'Redux/events/tree/operations';

const getCurrentChallenge = () => async (dispatch, getState) => {
  let currentInfo = null;
  let con = getState().chain.contract;
  try {
    currentInfo = await con.getCurrentVariables();
  } catch (e) {
    //possible that contract isn't deployed yet or is unreachable
    //for whatever reason.
  }

  let evt = null;
  if(currentInfo) {

    let payload = {
      event: "NewChallenge",
      returnValues: {
        _currentChallenge: currentInfo[0],
        _currentRequestId: currentInfo[1],
        _difficulty: currentInfo[2],
        _query: currentInfo[3],
        _multiplier: currentInfo[4]
      }
    };
    evt = eventFactory(payload);
    evt = evt.normalize();
    return evt;
  }
  return null;
}

const init = () => async (dispatch,getState) => {
  dispatch(Creators.loadRequest());
  let chain = getState().chain;
  let con = chain.chain.getContract();

  con.events.NewChallenge(null, async (e, evt)=>{
    if(evt) {
      if(evt.normalize) {
        evt = evt.normalize();
      }

      //if it's an empty challenge, have to reset state
      if(evt.id === 0) {
        dispatch(Creators.update(null))
      } else {

        let query = getState().events.tree.byId[evt.id];
        if(!query) {
          query = await dispatch(reqOps.findByRequestId(evt.id));
        }
        if(query) {
          dispatch(Creators.update({
            value: evt.tip,
            symbol: query.symbol,
            id: evt.id,
            challengeHash: evt.challengeHash
          }))
        }
      }
    }
  });

  con.events.NewValue(null, async (e, evt) => {
    if(evt) {
      if(evt.normalize) {
        evt = evt.normalize();
      }
      let query = getState().events.tree.byId[evt.id];
      if(!query) {
        query = await dispatch(reqOps.findByRequestId(evt.id));
      }
      if(query) {
        let current = getState().current.currentChallenge;
        if(current && current.challengeHash === evt.challengeHash) {
          let next = await dispatch(getCurrentChallenge());
          let minedSlots = 0; //TODO: get from on chain once we know time granularity
          if(next && next.id > 0) {
            dispatch(Creators.update(next, minedSlots));
          } else {
            dispatch(Creators.update(null));
          }
        }
      }
    }
  });

  con.events.NonceSubmitted(null, async (e, evt)=>{
    if(evt) {
      if(evt.normalize) {
        evt = evt.normalize();
      }
      let state = getState();
      let challenge = state.current.currentChallenge;
      if(challenge && challenge.challengeHash === evt.challengeHash) {
        dispatch(Creators.slotMined(evt));
      }
    }
  });

  //note that even though we store the new challenges and nonces,
  //we don't use them for initialization of the current challenge.
  //It's best to sync with the contract directly and avoid any race
  //or out of sync issues with our storage.

  let current = await dispatch(getCurrentChallenge());

  if(current) {
    //does the event refer to an ID we don't know about?
    let req = getState().events.tree.byId[current.id];
    if(!req) {
      await dispatch(reqOps.findByRequestId(current.id));
    }
    //order is hash, id, diff, querysString, multiplier,value
    if(!current || current.id === 0) {
      //nothing to do
      dispatch(Creators.loadSuccess(null, 0));
    } else {
      let count = 0; //await con.count(); //miners completed
      dispatch(Creators.loadSuccess(current, count));
    }
  }
}

export default {
  init
}
