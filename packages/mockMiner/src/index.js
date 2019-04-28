import "babel-polyfill";
import Chain from './ChainWrapper';
import TaskHandler from './TaskHandler';


const main = async () => {
  return new Promise((done,err)=>{
    let chain = new Chain({
      mnemonic: "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
      masterAddress: "0x2B63d6e98E66C7e9fe11225Ba349B0B33234D9A2"
    });

    chain.init().then(async ()=>{
      let task = new TaskHandler({
        chain
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
