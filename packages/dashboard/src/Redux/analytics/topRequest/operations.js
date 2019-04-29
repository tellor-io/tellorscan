import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import _ from 'lodash';

const init = () => async (dispatch,getState) => {
  dispatch(Creators.initStart());
  let con = getState().chain.contract;

  try {
    //read last 50 challenge requests and see which one was called the most
    let r = await Storage.instance.readAll({
      database: dbNames.NewChallenge,
      limit: 50,
      sort: [
        {
          field: "blockNumber",
          order: "desc"
        }
      ]
    });
    let counts = r.reduce((o, h)=>{
      if(!h || !h.id) {
        return o;
      }
      let obj = o[h.id] || {};
      let cnt = obj.count || 0;
      o[h.id] = {
        ...h,
        count: cnt+1
      };
      return o;
    },{});
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
