import EventEmitter from 'events';
import axios from 'axios';
import {toastr} from 'react-redux-toastr';
import AddressGenerator from '../AddressGenerator';

class Miner {
  constructor(props) {
    this.address = props.address;
    this.chain = props.chain;
    this.id = props.id;
    this.sleepTime = props.sleepTime;

    [
      'newChallenge'
    ].forEach(fn=>this[fn] = this[fn].bind(this));
  }

  newChallenge(challenge) {
    return new Promise((done,err)=>{
      setTimeout(()=>{
        try {
          axios({
            method: "GET",
            url: challenge.queryString
          }).then(r=>{
            let data = r.data;
            if(typeof data === 'string') {
              data = JSON.parse(data);
            }
            this.chain.getContract().proofOfWork(this.address,  Math.floor(Math.random()*1000),  challenge.id, data.price-0, challenge.challengeHash);
          })
          .catch(e=>{
            toastr.error("Query Problem", "Simulated miner could not retrieve data from url: " + e.message);
            err(e);
          })
        } catch (e) {
          toastr.error("Query Problem", "Simulated miner could not retrieve data from url: " + e.message);
          err(e);
        }
      }, this.sleepTime);
    });
  }
}

const MINER_COUNT = 5;
const MINER_MIN_SLEEP = 5000;
const MINER_MAX_SLEEP = 10000;

/**
 * Simulates miners working to retrieve data values
 */
export default class Simulator extends EventEmitter {
  constructor(props) {
    super(props);
    this.parentChain = props.chain;
    if(!this.parentChain) {
      throw new Error("Missing parent chain property");
    }
    this.miners = [];

    for(let i=0;i<MINER_COUNT;++i) {
      let addr = AddressGenerator(this.parentChain.web3);
      this.miners.push(new Miner({
        chain: props.chain,
        address: addr,
        id: i,
        sleepTime: Math.min(Math.floor(Math.random() * MINER_MAX_SLEEP) + MINER_MIN_SLEEP, MINER_MAX_SLEEP)
      }));
    }

    this.parentChain.getContract().events.NewChallenge(null, async (err,evt)=>{
      if(evt && evt._currentRequestId > 0) {
        this.miners.forEach(m=>m.newChallenge(evt.normalize()));
      }
    });
  }
}
