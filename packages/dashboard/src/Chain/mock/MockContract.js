import CoreLogic from './simulation/CoreLogic';
import SubscriptionProvider from '../SubscriptionProvider';

export default class MockContract {
  constructor(props) {
    this.chain = props.chain;
    this.logic = new CoreLogic(props);
    this.events = new SubscriptionProvider(props);
    //pass through the same interface as logic
    this.logic.supportedInterface.forEach(fn=>{
      this[fn] = this.logic[fn].bind(this.logic);
    });
    this.getPastEvents = this.chain.getPastEvents.bind(this.chain);
  }

}
