import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Streaming from './streaming';
import APIinQ from './apiInQ';

export default class Activity extends React.Component {
  render() {
    return (
      <Row className={cn(align.allCenter, align.full, "p-0", "m-0")}>
        <Col md="10" className={cn(align.leftCenter, "mb-1", "m-0", "p-0", "font-weight-light", "text-sz-md")}>
          Recent Activity
        </Col>
        <Col md="10" className={cn("activity-container", "rounded", align.allCenter, "p-0", "m-0")}>
            <Row className={cn(align.allCenter, align.full, "p-0", "m-0")}>
            <Col md="6" className={cn(align.allCenter, "pr-2")}>
              <Streaming />
            </Col>
            <Col md="6" className={cn(align.allCenter, "pl-2")}>
              <APIinQ />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
