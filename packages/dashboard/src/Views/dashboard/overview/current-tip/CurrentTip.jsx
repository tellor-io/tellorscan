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

export default class CurrentTip extends React.Component {

  render() {
    const {
      tip
    } = this.props;

    return (
      <Row className={cn(align.topCenter, align.full, "p-1", "m-0")}>
        <Col md="12" className={cn(LABEL_CLASS)}>
          Current Tip
        </Col>
        <Col md="12" className={cn(VALUE_CLASS)}>
          {tip}
        </Col>
      </Row>
    )
  }
}
