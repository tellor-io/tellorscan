import React from 'react';
import {
  Row,
  Col
} from 'reacstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class Costs extends React.Component {
  render() {

    return (
      <Row className={cn("cost-chart-wrapper", align.allCenter, align.full)}>
        <Col md="auto" className={cn("chart", align.allCenter)}>Graph</Col>
      </Row>
    )
  }
}
