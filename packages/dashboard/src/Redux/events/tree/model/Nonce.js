import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';
import eventFactory from 'Chain/LogEvents/EventFactory';

class Ops {
  constructor(props) {
    [
      'save'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  save(nonce) {
    return async (dispatch,getState) => {
      let data = _.keys(nonce.metadata).reduce((o,k)=>{
        let v = nonce.metadata[k];
        if(typeof v !== 'function') {
          o[k] = v;
        }
        return o;
      },{});

      try {
        console.log("Saving nonce data", data);
        await Storage.instance.create({
          database: dbNames.NonceSubmitted,
          key: nonce.transactionHash,
          data: {
            ...data,
            winningOrder: nonce.winningOrder
          }
        })
      } catch (e) {
        console.log("Problem saving nonce", e);
      }

    }
  }
}

let opInst = new Ops();

export default class Nonce {

  static _retrieveFromCache(challengesByHash) {
    return async (dispatch, getState) => {
      let byHash = {};
      let hashes = _.keys(challengesByHash);
      for(let i=0;i<hashes.length;++i) {
        let hash = hashes[i];
        let r = await Storage.instance.find({
          database: dbNames.NonceSubmitted,
          limit: 5,
          selector: {
            challengeHash: hash
          },
          order: [{
            field: 'blockNumber',
            direction: 'desc'
          }]
        });

        let nonces = r || [];
        if(nonces.length > 0) {
          byHash[hash] = nonces.map(n=>new Nonce({metadata: n}));
          byHash[hash].sort((a,b)=>{
            let diff = a.value-b.value;
            if(diff) {
              return diff;
            }
            diff = a.blockNumber-b.blockNumber;
            if(diff) {
              return diff;
            }
            return a.logIndex - b.logIndex;
          });

          //FIXME: This saves round-trip to contract to ask for winning
          //miners. But we're making an assumption that the sorted order
          //is actually the correct order. This might need to be changed.
          byHash[hash].forEach((n,i)=>{
            if(n.winningOrder < 0) {
              n.winningOrder = i;
            }
          });
        }
      }
      return byHash;
    }
  }

  static _storePastNonce(e) {
    return Storage.instance.create({
      database: dbNames.NonceSubmitted,
      key: e.transactionHash,
      data: e
    })
  }

  static _readMissingNonces({gaps, noncesByHash}) {
    return async (dispatch, getState) => {
      let chain = getState().chain.chain;
      let con = getState().chain.contract;
      //we need to also get all past request events
      //that we might be missing
      for(let i=0;i<gaps.length;++i) {
        let g = gaps[i];
        let evts = await con.getPastEvents("NonceSubmitted", {
          fromBlock: g.start,
          toBlock: g.end
        });
        for(let j=0;j<evts.length;++j) {
          let evt = evts[j];
          let e = eventFactory(evt);

          if(e) {
            let ts = await chain.getTime(e.blockNumber);
            e.timestamp = ts;
            let norm = e.normalize();
            let list = noncesByHash[norm.challengeHash] || [];
            if(list.length === 5) {
              continue;
            }
            await Nonce._storePastNonce(e.toJSON());
            let n = new Nonce({
              metadata: norm
            });
            list.push(n);
            noncesByHash[n.challengeHash] = list;
          }
        }
      }
    }
  }

  static loadAll(missingBlocks, challengesByHash) {
    return async (dispatch, getState) => {
    //  console.log("Loading nonces from cache...");
      let byHash = await dispatch(Nonce._retrieveFromCache(challengesByHash));
    //  console.log("Read", _.keys(byHash).length);
    //  console.log("Reading nonces from chain...");
    //  await dispatch(Nonce._readMissingNonces({gaps: missingBlocks, noncesByHash: byHash}));
    //  console.log("Now have", _.keys(byHash).length, "nonces");
      return byHash;
    }
  }

  constructor(props) {
    let meta = props.metadata;
    this.metadata = props.metadata;

    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    });
  }

  static get ops() {
    return opInst;
  }
}
