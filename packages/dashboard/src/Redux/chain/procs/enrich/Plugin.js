/**
 * Captures basic plugin functionality
 */

export default class Plugin {
  constructor(props) {
    this.id = props.id;
    this.fnContexts = props.fnContexts;

    if(typeof this['process'] !== 'function') {
      throw new Error("Enrichment plugins must implement process function");
    }
  }
}
