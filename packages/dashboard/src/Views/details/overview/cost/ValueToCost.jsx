import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class ValueToCost extends React.Component {
  render() {
    return (
      <Row className={cn("cost-container", "border", "rounded", "m-3", align.topCenter, align.full)}>
        <Col md="12">Value to Cost Chart</Col>
      </Row>
    )
  }
}
