import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import ChallengeViewer from 'Components/ChallengeViewer/ChallengeViewer';

export default class Activity extends React.Component {

  componentWillMount() {
    if(this.props.needsSearch && (!this.props.metadata || !this.props.metadata.id)) {
      //need to initialize
      this.props.doSearch();
    }
  }

  render() {
    const {
      challenges
    } = this.props;

    return (
      <Row className={cn("activity-table-container",align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <div className={cn("activity-header", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
            <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
              Recent Requests
            </span>
          </div>
          <div className={cn(align.full, align.topCenter, "pr-5", "pl-5", align.noMarginPad)}>
            <ChallengeViewer dispute={this.props.selectForDispute} noId noSymbol data={challenges} />
          </div>
        </Col>


      </Row>
    )
  }


}
