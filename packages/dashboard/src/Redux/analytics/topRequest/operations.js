import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import _ from 'lodash';

const init = () => async (dispatch,getState) => {
  dispatch(Creators.initStart());
  try {

    let counts = {};
    await Storage.instance.iterate({
      database: dbNames.NewChallenge,
      callback: (v, k) => {
        let obj = counts[v.id] || {}
        let cnt = obj.count || 0;
        counts[v.id] = {
          ...v,
          count: cnt+1
        };
      }
    });
   
    let top = _.values(counts);
    top.sort((a,b)=>{
      return b.count - a.count;
    });
    let topReq = top[0] || {};

    dispatch(Creators.initSuccess({
      id: topReq.id,
      count: topReq.count
    }, counts));
  } catch (e) {
    dispatch(Creators.failure(e));
  }
}

const challengeIssued = evt => dispatch => {
  dispatch(Creators.updateSuccess(evt));
}

export default {
  init,
  challengeIssued
}
