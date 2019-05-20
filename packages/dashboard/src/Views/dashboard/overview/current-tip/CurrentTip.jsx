import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import plus from 'Assets/images/Plus.svg';

import {
  LABEL_CLASS,
  VALUE_CLASS
} from 'Views/dashboard/overview/common';

export default class CurrentTip extends React.Component {

  render() {
    const {
      tip
    } = this.props;
    //<i className={cn("fa fa-plus", "text-muted", "font-weight-light")}/>
    /*
    <div className={cn(align.topCenter, align.noMarginPad, "text-muted", "font-weight-light", "text-sz-md")}>
      +
    </div>
    */
    return (
      <Row className={cn("current-tip", align.topCenter, align.full, "p-1", "m-0")}>
        <Col md="12" className={cn(align.leftCenter, align.full)}>
          <Row className={cn(align.leftCenter, align.full)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              <img src={plus} width="25px" height="25px" />
            </Col>
            <Col md="10" className={cn(LABEL_CLASS)}>
              Current Request Tip
            </Col>
          </Row>
        </Col>
        <Col md="12" className={cn(align.leftCenter, align.full)}>
          <Row className={cn(align.leftCenter, align.full)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              &nbsp;
            </Col>
            <Col md="10" className={cn(VALUE_CLASS)}>
              {tip}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
