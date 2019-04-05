import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';
import _ from 'lodash';

const incomingEvent = async (dispatch, getState, evt) => {

  await Storage.instance.create({
    database: evt.event,
    key: evt._apiId,
    data: evt.toJSON()
  });

  dispatch(Creators.addEvent(evt.normalize()));
}

const init = () => async (dispatch,getState) => {
  let state = getState();
  let con = state.chain.contract;
  dispatch(Creators.initStart());

  //subscribe to new events
  con.events.NonceSubmitted(null, (e, evt)=>{
    if(evt) {
      incomingEvent(dispatch, getState, evt);
    }
  });
  con.events.NewValue(null, (e, evt)=>{
    if(evt) {
      incomingEvent(dispatch, getState, evt);
    }
  })


  //read all current events
  let r = await Storage.instance.read({
    database: dbNames.NonceSubmitted,
    limit: 50,
    order: [{
      field: '_apiId',
      direction: 'desc'
    }]
  });

  let events = _.get(r, "data", []);

  r = await Storage.instance.read({
    database: dbNames.NewValue,
    limit: 50,
    order: [{
      field: '_apiId',
      direction: 'desc'
    }]
  });
  events = [
    ...events,
    ..._.get(r, "data", [])
  ];
  events.sort((a,b)=>{
    if(a.blockNumber > b.blockNumber) {
      return 1;
    } else if(a.blockNumber < b.blockNumber) {
      return -1
    } else if(a._apiId > b._apiId) {
      return 1;
    } else if(a._apiId < b._apiId) {
      return -1;
    }
    return 0;
  });
  let normProps = {
    chain: state.chain.chain,
    storage: Storage.instance
  };
  dispatch(Creators.initSuccess(events.map(e=>eventFactory(e).normalize(normProps))));

}

const lookup = id => async (dispatch,getState) => {

}

export default {
  init,
  lookup
}
