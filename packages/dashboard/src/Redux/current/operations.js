import {Creators} from './actions';
import eventFactory from 'Chain/LogEvents/EventFactory';
import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';
import {default as reqOps} from 'Redux/events/requests/operations';

const init = () => async (dispatch,getState) => {
  dispatch(Creators.loadRequest());
  let chain = getState().chain;
  let con = chain.chain.getContract();
  con.events.NewChallenge(null, async (e, evt)=>{
    if(evt) {

      //if it's an empty challenge, have to reset state
      if(evt._miningApiId === 0) {
        dispatch(Creators.update(null))
      } else {

        let query = getState().events.requests.byId[evt._miningApiId];
        if(!query) {
          query = await dispatch(reqOps.lookup(evt._miningApiId));
        }
        if(query) {
          dispatch(Creators.update({
            value: evt._value,
            symbol: query.symbol,
            id: evt._miningApiId,
            challengeHash: evt._currentChallenge
          }))
        }
      }
    }
  });

  con.events.NonceSubmitted(null, async (e, evt)=>{
    if(evt) {

      let state = getState();
      let challenge = state.current.currentChallenge;
      if(challenge && challenge.challengeHash === evt._currentChallenge) {
        dispatch(Creators.slotMined(evt.normalize()));
      }
    }
  });

  //note that even though we store the new challenges and nonces,
  //we don't use them for initialization of the current challenge.
  //It's best to sync with the contract directly and avoid any race
  //or out of sync issues with our storage.

  let currentInfo = await con.getVariables();
  //order is hash, id, diff, querysString, multiplier
  if(currentInfo[1] === 0) {
    //nothing to do
    dispatch(Creators.loadSuccess(null, 0));
  } else {
    let payload = {
      event: "NewChallenge",
      returnValues: {
        _currentChallenge: currentInfo[0],
        _miningApiId: currentInfo[1],
        _difficulty_level: currentInfo[2],
        _api: currentInfo[3]
      }
    };
    let evt = eventFactory(payload);
    let count = await con.count(); //miners completed

    dispatch(Creators.loadSuccess(evt.normalize(), count));
  }
}

export default {
  init
}
