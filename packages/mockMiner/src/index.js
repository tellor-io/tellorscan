import "babel-polyfill";
import Chain from './ChainWrapper';
import TaskHandler from './TaskHandler';
import Web3 from 'web3';
import moment from 'moment';

const DEFAULT_MINE_SLEEP = '65m';

const main = async () => {
  let addr = process.env.CONTRACT_ADDRESS;
  if(!addr) {
    throw new Error("Missing CONTRACT_ADDRESS environment var")
  }
  let web3Url = process.env.WEB3_URL;
  if(!web3Url) {
    throw new Error("Missing WEB3_URL environment var");
  }
  if(!web3Url.startsWith("ws")) {
    throw new Error("Only support websocket based web3 url: " + web3Url);
  }
  let sleepTime = process.env.MINE_SLEEP_CYCLE || DEFAULT_MINE_SLEEP;
  sleepTime = moment.duration(sleepTime);

  console.log("Mining sleep time", sleepTime);

  let requestRate = propcess.env.REQUEST_RATE || '0';
  requestRate = moment.duration(requestRate);
  console.log("Request rate", requestRate);

  let queryStr = process.env.QUERY_STR;

  let provider = new Web3.providers.WebsocketProvider(web3Url);

  let initRequired = process.env.INIT_REQUIRED;
  if(initRequired && initRequired.trim().length === 0){
    initRequired = undefined;
  }

  return new Promise((done,err)=>{
    let chain = new Chain({
      mnemonic: "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
      masterAddress: addr,
      provider
    });

    chain.init().then(async ()=>{
      let task = new TaskHandler({
        chain,
        initRequired,
        miningSleepTime: sleepTime,
        queryString: queryStr,
        queryRate: requestRate
      });
      await task.start();
      done();
    });
  });
}

console.log("Starting mock miner...");
main().then(()=>{
  console.log("Done");
});
