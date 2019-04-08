import localforage from 'localforage';
import BaseDB, {
  createSchema,
  readSchema,
  readAllSchema,
  findSchema,
  updateSchema,
  removeSchema,
  sortData
} from './BaseDB';
import _ from 'lodash';
import * as dbNames from './DBNames';

const dbFactory = async props => {
  var db = await localforage.createInstance({
    name: props.name
  });
  return db;
}

const _buildSortFn = props => {
  if(!props.sort) {
    return undefined;
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

export default class LocalForage extends BaseDB {
  constructor(props) {
    super(props);
    this.querySizeLimit = props.querySizeLimit || 50;

    [
      'create',
      'read',
      'readAll',
      'find',
      'update',
      'remove',
      'clearAll'
    ].forEach(fn=>{
      this[fn]=this[fn].bind(this)
    });
  }

  async clearAll() {
    _.keys(dbNames).forEach(async k=>{
      if(k !== dbNames.ChainData) {
        let db = this.dbs[k];
        if(!db) {
          db = await dbFactory({name: k});
        }
        console.log("Dropping DB", k);
        db.dropInstance();
        this.dbs[k] = undefined;
      }
    })
  }

  async create(props) {
    createSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    await db.setItem(props.key, props.data);
  }

  async read(props) {
    readSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    let r = await db.getItem(props.key);
    return r ? [r] : [];
  }

  async readAll(props) {
    readAllSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);

    let set = [];
    let sortFn = _buildSortFn(props);
    let limit = props.limit || this.querySizeLimit;
    await db.iterate((v, k, itNum)=>{
      if(itNum > limit) {
        return set;
      }
      set.push(v);
      if(sortFn) {
        sortFn(set);
      }
    });
    return set;
  }

  async find(props) {
    findSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    let set = [];
    let sortFn = _buildSortFn(props);
    let limit = props.limit || this.querySizeLimit;
    let selKeys = _.keys(props.selector);

    await db.iterate((dbVal, dbKey, itNum)=>{
      let allMatch = true;
      console.log("Checking props", props.selector, dbVal);

      for(let i=0;i<selKeys.length;++i) {
        let p = selKeys[i];
        let tgt = props.selector[p];
        let v = dbVal[p];
        if(v !== tgt) {
          allMatch = false;
          break;
        }
      }
      if(allMatch) {
        set.push(dbVal);
      }
    });
    if(sortFn) {
      sortFn(set);
    }
    console.log("Find", props, set);
    return set;
  }

  async update(props) {

  }

  async remove(props) {

  }
}
