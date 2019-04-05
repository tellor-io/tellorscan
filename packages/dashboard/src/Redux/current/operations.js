import {Creators} from './actions';
import eventFactory from 'Chain/LogEvents/EventFactory';
import * as dbNames from 'Storage/DBNames';
import Storage from 'Storage';

const init = () => async (dispatch,getState) => {
  dispatch(Creators.loadRequest());
  let chain = getState().chain;
  let con = chain.chain.getContract();
  con.events.NewChallenge(null, async (e, evt)=>{
    if(evt) {
      await Storage.instance.create({
        database: dbNames.NewChallenge,
        key: evt._miningApiId,
        data: evt.toJSON()
      });

      //if it's an empty challenge, have to reset state
      if(evt._apiId === 0) {
        dispatch(Creators.update(null))
      } else {
        dispatch(Creators.update(evt.normalize()));
      }
    }
  });

  con.events.NonceSubmitted(null, async (e, evt)=>{
    if(evt) {
      await Storage.instance.create({
        database: dbNames.NonceSubmitted,
        key: evt._apiId,
        data: evt.toJSON()
      });

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

export default {
  init
}
