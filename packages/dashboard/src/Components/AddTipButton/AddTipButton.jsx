import React from 'react';
import {
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class AddTipButton extends React.Component {
  render() {
    const {
      hasTokens
    } = this.props;

    if(!hasTokens) {
      return (
        <div className={cn(align.allCenter, align.full)}>
          <Button onClick={this.props.getTokens} size="sm" className={cn("bg-secondary", "text-light")}>
            Get Tokens
          </Button>
        </div>
      )
    }

    return (
      <div className={cn(align.allCenter, align.full)}>
          <i className={cn("circle-button fa fa-plus", "text-tellor-green")}
            onClick={()=>this.props.onClick()}/>
      </div>
    )
  }
}
