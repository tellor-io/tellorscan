import React from 'react';
import cn from 'classnames';

export default class VoteButtons extends React.Component  {
  render() {
    const {
      canVote,
      voteReason
    } = this.props;

    if(canVote) {
      return (
        <React.Fragment>
          <i className={cn("fa fa-thumbs-up", "clickable-icon", "text-tellor-green", "mr-3")}
             onClick={this.props.voteUp}/>
          <i className={cn("fa fa-thumbs-down",  "clickable-icon", "text-tellor-green")}
             onClick={this.props.voteDn}/>
        </React.Fragment>
      )
    }
    return (
      <span className={cn("text-muted")}>
        {voteReason}
      </span>
    )
  }
}
