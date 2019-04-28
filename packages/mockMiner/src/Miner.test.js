import Chain from './ChainWrapper';
import Miner from './Miner';

describe("Miner", ()=>{
  it("should mine value", done=>{

    let chain = new Chain({
      mnemonic: "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish",
      masterAddress: "0x2B63d6e98E66C7e9fe11225Ba349B0B33234D9A2"
    });

    chain.init().then(()=>{

      let miner = new Miner({
        chain,
        account: chain.wallet.addresses[0]
      });
      chain.contract.getCurrentVariables()
        .then(vars=>{
          if(!vars._challenge) {
            return done();
          }
          miner.mine({
            challenge: vars._challenge,
            difficulty: vars._difficulty,
            queryString: vars._queryString
          }).then(nonce=>{
            console.log("Mining result", nonce);
            done();
          });
        });
    });

  }).timeout(30000);
})
