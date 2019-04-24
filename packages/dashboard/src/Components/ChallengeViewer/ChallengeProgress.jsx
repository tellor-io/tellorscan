import React from 'react';
import _ from 'lodash';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col
} from 'reactstrap';

class Slot extends React.Component {
  render() {
    const {
      checked
    } = this.props;
    let icon = cn("fa fa-square-o", "text-muted");
    if(checked) {
      icon = cn("fa fa-check-square", "text-tellor-green");
    }
    return (
      <div className={cn(align.allCenter, align.full, "slot")}>
        <i className={cn(icon)} />
      </div>
    )
  }
}

export default class ChallengeProgress extends React.Component {
  render() {
    const {
      challenge
    } = this.props;
    if(challenge.finalValue) {
      //all filled
      return (
        <Row className={cn("progress-slots", align.noMarginPad, align.allCenter, align.full)}>
          <Col md="12" className={cn(align.allCenter)}>
            <span className={cn("text-center", "text-sz-sm", "font-weight-light", "text-muted")}>
              mining complete
            </span>
          </Col>
        </Row>
      )
    }

    let filled = [false, false, false, false, false];
    _.values(challenge.nonces).forEach((n, i)=>filled[i]=true);

    return (
      <Row className={cn("progress-slots", align.noMarginPad, align.allCenter, align.full)}>
        <Col md="12" className={cn(align.allCenter)}>
          {
            filled.map((f,i)=>(
              <Slot key={i} checked={f} />
            ))
          }
        </Col>
      </Row>
    )
  }
}
