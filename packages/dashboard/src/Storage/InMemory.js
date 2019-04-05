
/**
 * An in-memory implementation of storage. Mainly used for
 * testing
*/

let inst = null;
export default class InMemory {

  static get instance() {
    if(!inst) {
      throw new Error("Did not initialize storage in-memory impl");
    }
    return inst;
  }

  constructor(props) {
    this.store = {};
    this.highBlock = 0;
    [
      'create',
      'read',
      'update',
      'remove'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
    inst = this;
  }


  async create(props) {
    console.log("Will create", JSON.stringify(props, null, 2));
  }

  async read(props) {
    console.log("Will read", props)
    return [];
  }

  async update(props) {
    console.log("Will update", JSON.stringify(props, null, 2));
  }

  async remove(props) {

  }

}
