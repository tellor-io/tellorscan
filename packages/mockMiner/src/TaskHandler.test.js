import Chain from './ChainWrapper';
import TaskHandler from './TaskHandler';

const sleep = time => {
  new Promise(done=>{
    setTimeout(()=>done(), time)
  })
}

describe("TaskHandler", ()=>{
  it("should continuously try to mine", done=>{

    let chain = new Chain({
      mnemonic: "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
      masterAddress: "0x2B63d6e98E66C7e9fe11225Ba349B0B33234D9A2"
    });

    chain.init().then(async ()=>{
      let task = new TaskHandler({
        chain
      });
      task.start();
      await sleep(30000);
      task.stop();
      await sleep(30000);
    });

  }).timeout(60000);
})
