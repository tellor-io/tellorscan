import * as yup from 'yup';
import _ from 'lodash';
import Storage from 'Storage';

const procSchema = yup.object().shape({
  id: yup.string().required("Missing processor id")
});

/**
 * Processing router that gives a context to block processing modules.
 * This allows us to string togther a series of processors in a generic
 * way without concern for order of operations within any individual
 * processing module.
 */
export default class EthProcessor {
  constructor(props) {
    //all processors keyed by their required "id" property (see schema above)
    this.processors = {};

    //the data source for the processing flow
    this.sourceProcessor = null;

    //offset counter for installed processors
    this.count = 0;

    [
      'source',
      'add',
      'init',
      'unload',
      'ready',
      '_checkExists',
      '_initProc',
      '_unloadProc'
    ].forEach(fn=>{
      if(!this[fn]) {
        throw new Error("Need to implement: " + fn);
      }
      this[fn] = this[fn].bind(this);
    });
  }

  /**
    * Set the data source for the flow. This must implement a start
    * function that is given a next function to call for each new data
    * item to process.
    */
  source(proc) {
    if(!proc) {
      return;
    }
    procSchema.validateSync(proc);
    if(this.sourceProcessor) {
      throw new Error("Processors already have a source with id: " + this.sourceProcessor.id);
    }
    this.sourceProcessor = proc;
    return this;
  }

  /**
   * Add a processor to the flow
   */
  add(proc) {
    if(!proc) {
      return;
    }
    procSchema.validateSync(proc);
    this._checkExists(proc);
    this.processors[proc.id] = {
      processor: proc,
      index: this.count
    }
    ++this.count;
    return this;
  }

  /**
   * Initialize the flow and all processors contained within it
   */
  init() {
    return async (dispatch, getState) => {
      let procs = _.values(this.processors);
      procs.sort((a,b)=>a.index-b.index);
      await dispatch(this._initProc(this.sourceProcessor));
      for(let i=0;i<procs.length;++i) {
        await dispatch(this._initProc(procs[i].processor));
      }
    }
  }

  /**
   * Unload the processing flow. This may or may not be called
   * given the race for browser shutdown/unload callback.
   */
  unload() {
    return async (dispatch, getState) => {
      let procs = _.values(this.processors);
      procs.sort((a,b)=>a.index-b.index);
      await dispatch(this._unloadProc(this.sourceProcessor));
      for(let i=0;i<procs.length;++i) {
        await dispatch(this._unloadProc(procs[i].processor));
      }
    }
  }

  /**
   * Indicate that the flow is now ready to run. This must be called
   * only after all intiialization is complete.
   */
  ready() {
    return async (dispatch, getState) => {
      //if we've already started, don't start again
      if(this.startCtx) {
        return;
      }

      //get all processors to run in their index order
      let procs = _.values(this.processors);
      procs.sort((a,b)=>a.index-b.index);

      //Create the starting context for the source proc
      this.startCtx = new StartingCtx({
        processors: procs,
        dispatch,
        getState
      });

      //and use it to kick off the flow
      return dispatch(this.sourceProcessor.start(this.startCtx.next, this.startCtx.store));
    }
  }

  /**
   * Check whether a processor has been installed already with the same id
   */
  _checkExists(proc) {
    if(this.processors[proc.id]) {
      throw new Error("Already registered processor with id: " + proc.id);
    }
  }

  /**
   * Initialize a processor if it has an init function
   */
  _initProc(proc) {
    return (dispatch) => {
      if(proc && typeof proc.init === 'function') {
        return dispatch(proc.init());
      }
    }
  }

  /**
   * Unload a proc if it has an unload function
   */
  _unloadProc(proc) {
    return async (dispatch) => {
      if(proc && typeof proc.unload === 'function') {
        try {
          await dispatch(proc.unload());
        } catch (e) {
          console.log("Unload failure", e);
        }
      }
    }
  }
}



/**
 * Starting context is intended for the first source processor
 * that will push data through the flow. This context's 'next'
 * call kicks off a sub context for all downstream processors to
 * process the source's incoming data.
 */
class StartingCtx {
  constructor(props) {
    this.processors = props.processors;
    this.dispatch = props.dispatch;
    this.getState = props.getState;
    this.storageCtx = new StorageCtx({
      dispatch: props.dispatch,
      getState: props.getState
    });

    [
      'next',
      'store'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  next(data) {
    let sub = new SubCtx({
      processors: this.processors,
      dispatch: this.dispatch,
      getState: this.getState,
      storageCtx: this.storageCtx
    });

    let proc = sub.processors[0];
    if(proc) {
      return this.dispatch(proc.processor.process(data, sub.next, sub.store));
    }
  }

  store(props) {
    this.storageCtx.addStoredItem(props);
  }
}


/**
 * Sub context gets kicked off after the starting processor in a pipeline
 * completes and forwards data via the parent context's 'next' call.
 */
class SubCtx {
  constructor(props) {
    this.processors = props.processors;
    this.dispatch = props.dispatch;
    this.getState = props.getState;
    this.storageCtx = props.storageCtx;
    this.index = 0;
    [
      'next',
      'store'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  next(data) {
    //root processor was first for this context. Now we go to next
    ++this.index;
    //grab next processor if it exists
    let nextProc = this.processors[this.index];
    if(nextProc) {
      //if so, we kick it off with incomign data and callback to this
      //context's next function so that we keep moving forward through procs
      return this.dispatch(nextProc.processor.process(data, this.next, this.store));
    } else {
      return this.storageCtx.exec();
    }
  }

  store(props) {
    this.storageCtx.addStoredItem(props);
  }
}


class StorageCtx {
  constructor(props) {
    this.toStore = {};
    this.dispatch = props.dispatch;
    this.getState = props.getState;

    [
      'addStoredItem',
      'exec'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  addStoredItem({database, key, data}) {
    let dbItems = this.toStore[database] || {};
    dbItems[key] = data;
    this.toStore[database] = dbItems;
  }

  async exec() {
    let dbs = _.keys(this.toStore);
    let start = Date.now();
    let cnt = 0;

    for(let i=0;i<dbs.length;++i) {
      let db = dbs[i];
      let dbItems = this.toStore[db];

      let dbKeys = _.keys(dbItems);
      if(dbKeys.length === 0) {
        console.log("Have DB w/out keys", db);
        continue;
      }

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
      await Storage.instance.createBulk({
        database: db,
        items: storedItems
      });
    }
    this.toStore = {};
    console.log("Stored", cnt, "items in", (Date.now()-start),"ms");
  }
}
