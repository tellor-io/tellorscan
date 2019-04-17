import React from 'react';
import {
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class DisputeButton extends React.Component {
  render() {
    const {
      canDispute,
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

    if(!canDispute) {
      return (
        <div className={cn(align.allCenter, align.full, align.noMarginPad)}>
          <span className={cn(align.allCenter, align.noMarginPad, "bg-secondary", "text-light", "text-center", "text-sz-sm")}>
            in dispute already
          </span>
        </div>
      );
    }

    return (
      <Button size="sm" className={cn("dispute-button", "text-dark", "bg-tellor-green")}
              onClick={this.props.onClick}>Dispute</Button>

    )
  }
}
