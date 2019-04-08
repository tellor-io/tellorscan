import * as yup from 'yup';
import _ from 'lodash';

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

  sort: yup.array().of(sortSchema)
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

    [
      '_getDB'
    ].forEach(fn=>{
      this[fn]=this[fn].bind(this);
    });
  }

  async _getDB(props, factory) {
    let db = this.dbs[props.database];
    if(!db) {
      db = await factory({name: props.database});
      this.dbs[props.database] = db;
    }
    return db;
  }
}
