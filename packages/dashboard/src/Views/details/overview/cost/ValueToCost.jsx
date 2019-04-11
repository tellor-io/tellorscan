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
      <Row className={cn("cost-container", "border", "rounded",  align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.noMarginPad)}>Value to Cost Chart</Col>
      </Row>
    )
  }
}
