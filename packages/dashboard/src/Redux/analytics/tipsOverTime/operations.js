import {Creators} from './actions';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

const init = () => async (dispatch, getState) => {
  dispatch(Creators.initStart());
  let state = getState();
  let con = state.chain.contract;
  con.events.NewChallenge(null, async (e, evt)=>{
    if(!evt) {
      return;
    }

    if(evt.normalize) {
      evt = evt.normalize();
    }
    if(!evt.tip) {
      return;
    }
    console.log("Adding new challenge tip", evt);

    dispatch(Creators.update({
      timestamp: evt.timestamp,
      tip: evt.tip
    }));
  })

  let history = await Storage.instance.readAll({
    database: dbNames.NewChallenge,
    sort: [
      {
        field: 'blockNumber',
        order: 'desc'
      }
    ],
    limit: 144 //1 day, 10-min blocks
  });
  history = history.filter(h=>h.tip);
  //now we reverse the history so we get buckets filled in over time
  //so that the most recent bucket is the last bucket
  history.reverse();

  //lump into 15 buckets for display
  let buckets = [];
  let current = null;
  let itemsPerBucket = 10; //144 items, 10 items each bucket, will be 15 buckets
  for(let i=0;i<history.length;++i) {
    let h = history[i];
    if(!current || current.count === itemsPerBucket) {
      current = {
        count: 0,
        tipTotal: 0,
        timestamp: h.timestamp
      };
      buckets.push(current);
    }
    current.count++;
    current.tipTotal += h.tip;
  }

  dispatch(Creators.initSuccess(buckets));
}

export default {
  init
}
