import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Slots from './slots';
import {
  LABEL_CLASS,
  VALUE_CLASS
} from 'Views/dashboard/overview/common';

export default class CurrentApi extends React.Component {
  render() {
    const {
      current
    } = this.props;

    return (
      <Row className={cn("current-api", align.topCenter, align.full, "m-0", "p-0")}>
        <Col md="12" className={cn(LABEL_CLASS)}>
          Current API
        </Col>
        <Col md="12" className={cn(VALUE_CLASS)}>
          <span className={cn("text-left", "text-secondary", "mr-1", "m-0", "p-0")}>{`${current.id} - `}</span>
          <span className={cn("text-right", "font-weight-bold")}>{current.symbol}</span>
        </Col>
        <Col md="12" className={cn(align.allCenter, "m-0", "p-0")}>
          <Slots />
        </Col>
      </Row>
    )
  }
}
