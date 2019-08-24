import localforage from 'localforage';
import {extendPrototype} from 'localforage-setitems';
import BaseDB, {
  createSchema,
  createBulkSchema,
  bulkListSchema,
  readSchema,
  readAllSchema,
  findSchema,
  updateSchema,
  removeSchema,
  iterateSchema
} from './BaseDB';
import _ from 'lodash';
import * as dbNames from './DBNames';
import {Logger} from 'buidl-utils';

extendPrototype(localforage);

const log = new Logger({component: "LocalForageStorage"});

const dbFactory = async props => {
  log.debug("Creating DB", props.name);
  var db = await localforage.createInstance({
    name: props.name
  });
  return db;
}

const _buildSortFn = props => {
  if(!props.sort) {
    props.sort = [
      {
        field: "blockNumber",
        order: "desc"
      }
    ];
  }

  let sorter = (set, fld, isAsc) => {
    set.sort((a,b)=>{
      let av = a[fld];
      let bv = b[fld];
      if(av > bv) {
        return isAsc ? 1 : -1;
      }
      if(av < bv) {
        return isAsc ? -1 : 1;
      }
      return 0;
    });
  };
  return set => {
    props.sort.forEach(s=>{
      sorter(set, s.field, s.order.toUpperCase() === 'ASC')
    });
  }
}

let inst = null;
export default class LocalForage extends BaseDB {
  static get instance() {
    if(!inst) {
      throw new Error("Did not properly construct storage instance");
    }
    return inst;
  }

  constructor(props) {
    super(props);
    this.querySizeLimit = props.querySizeLimit || 50;

    [
      'create',
      'createBulk',
      'appendToList',
      'read',
      'readAll',
      'find',
      'update',
      'remove',
      'clearAll',
      'iterate'
    ].forEach(fn=>{
      this[fn]=this[fn].bind(this)
    });
    inst = this;
  }

  async clearAll() {
    let dbs = _.keys(dbNames);
    for(let i=0;i<dbs.length;++i) {
      let k = dbs[i];
      if(!k) {
        continue;
      }

      if(k !== dbNames.ChainData) {
        let pfx = this.dbPrefix || "";
        let nm = pfx + k;
        let db = await this._getDB({database: k}, dbFactory);
        if(!db) {
          return;
        }
        log.debug("Dropping DB", nm);
        await db.dropInstance();
        this.dbs[nm] = undefined;
      }
    }
  }

  async create(props) {
    createSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    try {
      await db.setItem(props.key, props.data);
    } catch (e) {
      log.error("Problem storing to", props.database, e);
    }

  }

  async createBulk(props) {
    createBulkSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    try {
      await db.setItems(props.items);
    } catch (e) {
      log.error("Problem storing items", props.database, e);
    }
  }

  async appendToList(props) {
    //same as create except we're going to append to an existing list of 
    //items or create a new array of items
    bulkListSchema.validateSync(props);
   
    let db = await this._getDB(props, dbFactory);
    try {
      await db.setItems(props.items);
    } catch (e) {
      log.error(e);
    }
  }

  async read(props) {
    readSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    let r = await db.getItem(props.key);
    if(r && r.__contents) {
      return r.__contents;
    }

    if(r && Array.isArray(r)) {
      return r;
    }
    return r ? [r] : [];
  }

  async readAll(props) {
    readAllSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);

    let set = [];
    let sortFn = _buildSortFn(props);
    let limit = props.limit || this.querySizeLimit;
    let filterFn = props.filterFn;
    if(props.sort && props.sort[0].field) {
      //we first have to sort all sort keys
      let allKeys = [];
      await db.iterate((v, k)=>{
        let fld = v[props.sort[0].field];
        allKeys.push({
          field: fld,
          value: v,
          key: k
        });
      });
      let isAsc = props.sort[0].order.toLowerCase() !== 'desc';
      allKeys.sort((a,b)=>{
        if(a.field > b.field) {
          return isAsc ? 1 : -1;
        }
        if(a.field < b.field) {
          return isAsc ? -1 : 1;
        }
      });
      //now just get the keys
      for(let i=0;i<allKeys.length;++i) {
        let a = allKeys[i];
        if(a) {
          if(typeof filterFn === 'function') {
            if(filterFn(a.value, a.key, i)) {
              set.push(a.value);
            }
          } else {
            set.push(a.value);
          }
        }
        if(set.length === limit) {
          return set;
        }
      }
      
      return set;
    }
    
    
    await db.iterate((v, k, itNum)=>{
      if(v.__contents) {
        v = v.__contents;
      }
      if(itNum > limit) {
        return set;
      }
      if(filterFn) {
        if(filterFn(v, k, itNum)) {
          set.push(v);
        }
      } else {
        set.push(v);
      }
    });
    if(sortFn) {
      sortFn(set);
    }
    return set;
  }

  async iterate(props) {
    iterateSchema.validateSync(props);
    if(typeof props.callback !== 'function') {
      throw new Error("Missing callback function");
    }
    let db = await this._getDB(props, dbFactory);
    await db.iterate(props.callback);
  }

  async find(props) {
    findSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    let set = [];
    let sortFn = _buildSortFn(props);
    let limit = props.limit || this.querySizeLimit;
    let selKeys = _.keys(props.selector);
    let offset = props.offset || 0;
    let includeTotal = props.includeTotal;
    let skipping = offset > 0;
    let endLength = offset + limit;

    let total = 0;
    await db.iterate((dbVal, dbKey, itNum)=>{
      if(dbVal.__contents) {
        dbVal = dbVal.__contents;
      }

      let allMatch = true;
      //filter based on selectors first. This way we make
      //sure paging and sorting work with the same dataset
      //each time. This is terribly slow but localforage/indexedDB
      //doesn't offer skipping records. An optimization might be
      //to keep our own index of record counts so that at a minimum
      //we're not running through entire set each time. Skipping would
      //still require walk from beginning. I don't know what happens if
      //records are inserted during paging operation...would we miss an
      //item if it's key were iterated earlier than the page we skipped?
      //This needs more thought.
      for(let i=0;i<selKeys.length;++i) {
        let p = selKeys[i];
        let tgt = props.selector[p];
        let v = dbVal[p];

        if(!isNaN(v) && !isNaN(tgt)) {
          v -= 0;
          tgt -= 0;
        }
        if(v !== tgt) {
          allMatch = false;
          break;
        }
      }
      if(allMatch) {
        ++total;
        if(!skipping && set.length < endLength) {
          set.push(dbVal);
        } else if(!skipping && set.length >= endLength && !includeTotal) {
          return set;
        }
      }

      skipping = total < offset || set.length > (offset+limit);
    });

    if(sortFn) {
      sortFn(set);
    }
    if(includeTotal) {
      return {
        total,
        data: set
      }
    }
    return set;
  }

  async update(props) {
    updateSchema.validateSync(props);
  }

  async remove(props) {
    removeSchema.validateSync(props);
  }
}
