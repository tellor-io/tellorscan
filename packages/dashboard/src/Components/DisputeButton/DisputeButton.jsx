import React from 'react';
import {
  Button
} from 'reactstrap';
import cn from 'classnames';

export default class DisputeButton extends React.Component {
  render() {
    const {
      hasTokens
    } = this.props;

    if(!hasTokens) {
      return (
        <Button size="sm" className={cn("text-light", "text-sz-sm", "bg-secondary")}
                onClick={this.props.getTokens}>
            Need Tokens
        </Button>
      )
    }

    return (
      <Button size="sm" className={cn("dispute-button", "text-dark", "bg-tellor-green")}
              onClick={this.props.onClick}>Dispute</Button>

    )
  }
}
