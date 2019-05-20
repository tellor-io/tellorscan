import {connect} from 'react-redux';
import Disputes from './Disputables';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import * as navs from 'Navs';
import {default as dispOps} from 'Redux/disputes/operations';
import {default as disputeOps, isDisputable} from 'Redux/disputes/operations';

const s2p = (state,own) => {

  let byId = state.requests.byId; //state.events.tree.byId;
  let id = own.match.params['apiID'];
  let reqs = _.values(byId);
  if(id) {
    if(byId[id]) {
      reqs = [byId[id]];
    }
  }
  let challenges = [];
  reqs.forEach(r=>{
    _.keys(r.challenges).forEach(k=>{

      let c = r.challenges[k];
      if(isDisputable(c)) {
        challenges.push(c);
      }
    });
  });
  let current = state.requests.current || {}; //state.current.currentChallenge || {};

  challenges.sort((a,b)=>{
    return b.blockNumber - a.blockNumber;
  });
  let idx = _.find(challenges, c=>c.challengeHash === current.challengeHash);
  let match = idx >= 0 ? challenges[idx] : null;
  if(match) {
    challenges.splice(idx, 1);
    challenges = [
      match,
      ...challenges
    ]
  }

  let selCh = state.disputes.selectedChallenge || {};
  let selNonce = state.disputes.selectedNonce || {};
  return {
    expandedHash: selCh.challengeHash,
    selectedNonce: selNonce,
    challenges,
    loading: state.requests.loading || state.init.loading
  }
}

const d2p = (dispatch,own) => {
  return {
    showDetails: id => {
      let url = navs.DETAILS_HOME + '/' + id;
      own.history.push(url);
    },
    selectForDispute: (ch, nonce) => {
      dispatch(dispOps.selectForDispute(ch, nonce));
    },
    toggleDisputeSelection: (ch) => {
      dispatch(dispOps.toggleDisputeSelection(ch));
    },
    initiateDispute: (ch, nonce) => {
      console.log("Incoming nonce", nonce);
      let props = {
        miner: {
          index: nonce.winningOrder,
          address: nonce.miner
        },
        requestId: ch.id,
        timestamp: ch.finalValue.mineTime
      };
      dispatch(disputeOps.initDispute(props));
    }
  }
}

export default withRouter(connect(s2p, d2p)(Disputes));
