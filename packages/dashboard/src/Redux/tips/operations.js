import {Creators} from './actions';
import {registerDeps} from 'Redux/DepMiddleware';
import {Types as reqTypes} from 'Redux/events/tree/actions';
import _ from 'lodash';

const currentTip = id => async (dispatch, getState) => {
  let con = getState().chain.contract;
  if(!con) {
    return 0;
  }
  let vals = await con.getApiVars(id);
  return vals[5] || 0;
}

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  registerDeps([reqTypes.ADD_REQUEST], ()=>{
    let cTips = getState().tips.byId;
    let allReqs = getState().events.tree.byId;
    _.keys(allReqs).forEach(async k=>{
      let cTip = cTips[k];
      if(typeof cTip === 'undefined' || cTip === null) {
        cTip = await dispatch(currentTip(k));
        dispatch(Creators.update(k, cTip));
      }
    })
  });

  let con = getState().chain.contract;
  con.events.NewValue(null, async (e, evt) => {
    if(evt) {
      if(evt.normalize) {
        evt = evt.normalize();
      }
      let tip = await dispatch(currentTip(evt.id));
      dispatch(Creators.update(evt.id, tip));
    }
  });

  con.events.TipAdded(null, async (e, evt)=> {
    if(evt) {
      if(evt.normalize) {
        evt = evt.normalize();
      }
      let tip = await dispatch(currentTip(evt.id));
      dispatch(Creators.update(evt.id, tip));
    }
  });

  let allReqs = getState().events.tree.byId;
  let allTips = {};
  _.keys(allReqs).forEach(async k=>{
    let tip = await dispatch(currentTip(k));
    allTips[k] = tip;
  });
  dispatch(Creators.initSuccess(allTips));
}

export default {
  init
}
