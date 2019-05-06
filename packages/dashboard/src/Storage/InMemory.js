import _ from 'lodash';
import BaseDB, {
  createSchema,
  createBulkSchema,
  readSchema,
  readAllSchema,
  findSchema,
  updateSchema,
  removeSchema,
  sortData
} from './BaseDB';
import * as dbNames from './DBNames';

const _sort = (ar, def) => {
  sortData(ar, def);
}

class DB {
  constructor(props) {
    this.name = props.name;
    this.maxHistory = props.maxHistory;
    this.kvs = {};
    [
      'create',
      'createBulk',
      'read',
      'readAll',
      'find',
      '_findBySelector',
      'update',
      'remove',
      'clearAll'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  clearAll() {
    this.kvs = {};
  }

  create(props) {
    this.kvs[props.key] = {
      ...props.data
    }
  }

  createBulk(props) {
    props.items.forEach(i=>{
      this.kvs[i.key] = {
        ...i.data
      }
    });
  }

  read(query) {
    let key = query.key;
    let v = this.kvs[key];
    if(v) {
      return [v];
    }
    return [];
  }

  readAll(query) {
    let limit = query.limit || this.maxHistory;
    let sort = query.sort;
    let data = _.keys(this.kvs).map(k=>this.kvs[k]);
    if(sort) {
      sort.forEach(s=>{
        _sort(data, s);
      })
    }
    if(data.length > limit) {
      data = data.slice(0, limit);
    }
    return data;
  }

  async find(query) {
    return this._findBySelector(query);
  }

  _findBySelector(props) {
    let sel = props.selector;
    let set = _.keys(this.kvs).map(k=>{
      let d = this.kvs[k];
      let props = _.keys(sel);
      let allMatch = true;

      for(let i=0;i<props.length;++i) {
        let p = props[i];
        let tgt = sel[p];
        let v = d[p];
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
        return d;
      }
      return null;

    }).filter(e=>e!==null);
    if(props.sort) {
      props.sort.forEach(s=>{
        _sort(set, s);
      })
    }
    return set.filter(s=>s!==null);
  }

  update(props) {
    let ex = this.kvs[props.key];
    this.kvs[props.key] = {
      ...ex,
      ...props.data
    }
  }

  remove(props) {
    this.kvs[props.key] = undefined;
  }
}

let inst = null;
export default class InMemory extends BaseDB {

  static get instance() {
    if(!inst) {
      throw new Error("Did not initialize storage in-memory impl");
    }
    return inst;
  }

  constructor(props) {
    super(props);
    console.log("Creating data store instance");
    this.dbs  = {};
    this.highBlock = 0;
    this.maxHistory = props.maxHistory;
    this.next = props.next;
    if(!this.next) {
      this.next = {}
    };

    [
      'create',
      'createBulk',
      'read',
      'readAll',
      'find',
      'update',
      'remove',
      'dbFactory',
      'iterate',
      'clearAll'
    ].forEach(fn=>{
      this[fn]=this[fn].bind(this)
      if(!this.next[fn]) {
        this.next[fn] = () => {}
      }
    });

    inst = this;
  }

  async dbFactory(props) {
    return new DB({
      ...props,
      maxHistory: this.maxHistory
    })
  }

  async clearAll() {
    _.keys(dbNames).forEach(k=>{
      if(k !== dbNames.ChainData) {
        if(this.dbs[k]) {
          console.log("Clearing in-memory", k);
          this.dbs[k].clearAll();
        }
      }
    });

    return this.next.clearAll();
  }

  async iterate(props) {
    //intended for slower DB walk through
    return this.next.iterate(props);
  }

  async create(props) {
    createSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);
    db.create(props);
    this.next.create(props);
  }

  async createBulk(props) {
    createBulkSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);
    db.createBulk(props);
    this.next.createBulk(props);
  }

  async read(props) {
    readSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);

    let res = db.read(props);
    if(res.length === 0) {
      return this.next.read(props);
    }
    return res;
  }

  async readAll(props) {
    readAllSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);
    let res = db.readAll(props);
    if(res.length === 0) {
      return this.next.readAll(props);
    }
    return res;
  }

  async find(props) {
    findSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);
    let res = await db.find(props);
    if(res.length === 0) {
      return this.next.find(props);
    }
    return res;
  }

  async update(props) {
    updateSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);
    db.update(props);
    this.next.udpate(props);
  }

  async remove(props) {
    removeSchema.validateSync(props);
    let db = await this._getDB(props, this.dbFactory);
    db.remove(props);
    this.next.remove(props);
  }

}
