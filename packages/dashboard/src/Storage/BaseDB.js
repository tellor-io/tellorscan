import * as yup from 'yup';

/**
 * An in-memory implementation of storage. Mainly used for
 * testing
*/
const dbBaseSchema = yup.string().required("Missing database parameter");

export const createSchema = yup.object().shape({
  //database where to store the data
  database: dbBaseSchema,

  //key to use for primary id
  key: yup.string().required("Need a key to store data"),

  //the data to store
  data: yup.object().required("Missing data object to store")
});

export const createBulkSchema = yup.object().shape({
  database: dbBaseSchema,

  items: yup.array().of(yup.object().shape({
    key: yup.string().required("Need a key to store data"),
    value: yup.object().required("Missing value object to store")
  }))
});

export const sortSchema = yup.object().shape({
  field: yup.string().required("Missing sort field name"),
  order: yup.string().required("Missing order")
});

export const readSchema = yup.object().shape({

  database: dbBaseSchema,

  //or directly with key
  key: yup.string().required("Missing key to read by id"),

  limit: yup.number(),

  sort: yup.array().of(sortSchema)
});

export const findSchema = yup.object().shape({
  database: dbBaseSchema,

  selector: yup.object().required("Must have a selector for finding by field"),

  limit: yup.number(),

  sort: yup.array().of(sortSchema).nullable()
});

export const removeSchema = yup.object().shape({
  database: dbBaseSchema,
  key: yup.string().required("Need key to remove data from database")
});

export const updateSchema = yup.object().shape({
  database: dbBaseSchema,
  key: yup.string().required("Missing database key"),
  data: yup.object().required("Missing data to update")
});

export const readAllSchema = yup.object().shape({
  database: dbBaseSchema,
  limit: yup.number(),
  sort: yup.array().of(sortSchema)
});

export const iterateSchema = yup.object().shape({
  database: dbBaseSchema
});

export const sortData = (ar, def) => {
  ar.sort((a,b)=>{
    let fld = def.field;
    let o = def.order.toUpperCase();
    let isAsc = o === 'ASC';
    let av = a[fld];
    let bv = b[fld];
    if(av > bv) {
      return isAsc?1:-1;
    }
    if(av < bv) {
      return isAsc?-1:1;
    }
    return 0;
  })
}

export default class BaseDB {

  constructor(props) {
    this.dbs  = {};
    this.next = props.next;
    if(!this.next) {
      this.next = {}
    };
    this.dbPrefix = props.dbPrefix || "";

    [
      'init',
      '_getDB'
    ].forEach(fn=>{
      this[fn]=this[fn].bind(this);
    });
  }

  async init(props) {
    console.log("Initializing with props", props);
    let pfx = props.dbPrefix;
    if(pfx) {
      pfx += "_";
    }
    this.dbPrefix = pfx || "";
  }

  async _getDB(props, factory) {
    if(!props.database) {
      console.log("Incoming props", props);
      throw new Error("No database name provided");
    }

    let name = this.dbPrefix + props.database;

    let db = this.dbs[name];

    if(!db) {
      db = await factory({name});
      this.dbs[name] = db;
    }
    return db;
  }
}
