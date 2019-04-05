/*
 * web3 implementation of chain access
 */

export default class Web3Wrapper {
  constructor(props) {

    [
      'latestBlock',
      'getPastEvents',
      'subscribe'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  async latestBlock() {

  }

  async getPastEvents(props) {

  }

  async subscribe(props) {

  }
}
