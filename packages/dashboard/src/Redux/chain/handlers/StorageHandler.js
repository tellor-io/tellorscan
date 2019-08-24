import {Handler} from 'eth-pipeline';
import Storage from 'Storage';
import {Logger} from 'buidl-utils';
import _ from 'lodash';

const log = new Logger({component: "StorageHandler"});

export default class StorageHandler extends Handler {
    constructor(props) {
        super({name: "StorageHandler"});
        this.sCtx = new StorageCtx();
        [
            'init',
            'newBlock',
            '_setup'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    async init(ctx, next) {
      return this._setup(ctx, next);
    }

    async newBlock(ctx, block, next) {
      return this._setup(ctx, next);
    }

    
    async _setup(ctx, next) {
        ctx.store = async (props) => {
            await this.sCtx.addStoredItem(props);
        }

        ctx.appendToList = async (props) => {
          await this.sCtx.appendToList(props);
        }

        ctx.flush = async () => {
            await this.sCtx.flush();
        }
        return next();
    }
}



class StorageCtx {
    constructor() {
      this.toStore = {};
      this.toAppend = {};
  
      [
        'addStoredItem',
        'appendToList',
        'flush'
      ].forEach(fn=>this[fn]=this[fn].bind(this));
    }
  
    addStoredItem({database, key, data}) {
      let dbItems = this.toStore[database] || {};
      dbItems[key] = data;
      this.toStore[database] = dbItems;
    }

    appendToList({database, key, data}) {
      let dbItems = this.toAppend[database] || {};
      let a = dbItems[key] || [];
      a.push(data);
      dbItems[key] = a;
      this.toAppend[database] = dbItems;
    }
  
    async flush() {
      let dbs = _.keys(this.toStore);
      dbs = [
        ...dbs,
        ..._.keys(this.toAppend)
      ];
      let start = Date.now();
      let cnt = 0;
  
      for(let i=0;i<dbs.length;++i) {
        let db = dbs[i];
        let dbItems = this.toStore[db] || {};
        let appends = this.toAppend[db] || {};
  
        let dbKeys = _.keys(dbItems);
        let appendKeys = _.keys(appends);

        if(dbKeys.length > 0) {
          let storedItems = [];
    
          for(let j=0;j<dbKeys.length;++j) {
            let key = dbKeys[j];
            let data = dbItems[key];
            ++cnt;
            storedItems = [
              ...storedItems,
              {key, value: data}
            ]
          }
          if(storedItems.length > 0) {
            await Storage.instance.createBulk({
              database: db,
              items: storedItems
            });
          }
        }

        if(appendKeys.length > 0) {
          let storedItems = [];
          for(let j=0;j<appendKeys.length;++j) {
            let key = appendKeys[j];
            let data = appends[key];
            if(data) {
              if(!Array.isArray(data)) {
                let a = [data];
                data = a;
              }
              let current = await Storage.instance.read({
                database: db,
                key: key
              });
              if(!current) {
                current = [];
              }
              data = _.intersection(data, current, _.isEqual);
              storedItems = [
                ...storedItems,
                {key, value: data}
              ]
            }
          }
          if(storedItems.length > 0) {
            await Storage.instance.appendToList({
              database: db,
              items: storedItems
            })
          }
          
        }
      }
      this.toStore = {};
      this.toAppend = {};
      log.debug("Stored", cnt, "items in", (Date.now()-start),"ms");
    }
  }