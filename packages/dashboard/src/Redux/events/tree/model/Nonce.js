import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

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

      await Storage.instance.create({
        database: dbNames.NonceSubmitted,
        key: nonce.transactionHash,
        data: {
          ...data,
          winningOrder: nonce.winningOrder
        }
      })
    }
  }
}

let opInst = new Ops();

export default class Nonce {
  static loadAll(challengesByHash) {
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
        byHash[hash] = nonces.map(n=>new Nonce({metadata: n}));
      }
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
