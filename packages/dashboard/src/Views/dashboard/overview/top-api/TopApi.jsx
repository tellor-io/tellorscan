import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  LABEL_CLASS,
  VALUE_CLASS
} from 'Views/dashboard/overview/common';

export default class TopApi extends React.Component {
  render() {
    const {
      top
    } = this.props;
    if(!top) {
      return null;
    }

    return (
      <Row className={cn(align.topCenter, align.full, "p-1", "m-0")}>
        <Col md="12" className={cn(align.leftCenter, align.full)}>
          <Row className={cn(align.leftCenter, align.full)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              <i className={cn("cui-chevron-top", "text-muted", "font-weight-light")}/>
            </Col>
            <Col md="10" className={cn(LABEL_CLASS)}>
              Top Requested ID
            </Col>
          </Row>
        </Col>
        <Col md="12" className={cn(align.leftCenter, align.full)}>
          <Row className={cn(align.leftCenter, align.full)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              &nbsp;
            </Col>
            <Col md="10" className={cn(VALUE_CLASS)}>
              {top}
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
