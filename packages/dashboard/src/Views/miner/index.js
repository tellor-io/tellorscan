import {connect} from 'react-redux';
import Miner from './Miner';
import _ from 'lodash';
import {humanizeTellor} from 'Utils/token';

const s2p = state => {
  let miners = _.values(state.analytics.mining.topMiners);
  miners.sort((a,b)=>{
    let aBal = humanizeTellor(a.balance);
    let bBal = humanizeTellor(b.balance);
    return bBal - aBal;
  });

  return {
    miners
  }
}

const d2p = dispatch => {
  return {
    download: () => {
      window.open("https://github.com/tellor-io/TellorMiner", "_blank");
    },
    discord: () => {
      window.open("https://discord.gg/n7drGjh", "_blank");
    }
  }
}

export default connect(s2p, d2p)(Miner);
