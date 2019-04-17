import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Loading from 'Components/Loading';

export default class ChallengeValue extends React.Component {
  render() {
    const {
      challenge
    } = this.props;
    let fv = challenge.finalValue;
    if(!fv) {
      return (
        <div className={cn(align.allCenter, align.full, align.noMarginPad)} style={{width: '40px', height: '40px'}}>
          <i className={cn("fa fa-spinner fa-spin", "text-sz-md", align.full, align.allCenter, align.noMarginPad)} />
        </div>
      )
    }
    return (
      <div className={cn(align.leftCenter, align.full, align.noMarginPad, "bg-tellor-muted", "rounded")}>
        <span className={cn("text-center", align.full)}>
          {fv.value}
        </span>
      </div>
    )
  }
}
