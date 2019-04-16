import _ from 'lodash';
import Storage from 'Storage';
import * as dbNames from 'Storage/DBNames';

export default class NewValue {
  static loadAll(byHash) {
    return async (dispatch,getState) => {
      let r = await Storage.instance.readAll({
        database: dbNames.NewValue,
        limit: 50,
        order: [{
          field: 'blockNumber',
          direction: 'desc'
        }]
      });
      let byHash = {};
      let values = r || [];
      values.forEach(v=>{
        byHash[v.challengeHash] = new NewValue({
          metadata: v
        })
      });
      return byHash;
    }
  }

  constructor(props) {
    let meta = props.metadata;
    this.metadata = meta;
    _.keys(meta).forEach(k=>{
      let v = meta[k];
      if(typeof v !== 'function') {
        this[k] = v;
      }
    });
  }
}
