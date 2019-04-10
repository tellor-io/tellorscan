import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Chart from './Chart';
import Loading from 'Components/Loading';

export default class Costs extends React.Component {
  render() {
    const {
      loading,
      buckets
    } = this.props;

    return (
      <Row className={cn("cost-chart-wrapper", align.topCenter, align.full, align.noMarginPad)}>
        <Loading loading={loading} />
        <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
          Recent Query Cost (Avg.)
        </Col>
        <Col md="12" className={cn("chart", align.allCenter)}>
          <Chart data={buckets} />
        </Col>
        <Col md="12" className={cn("chart", align.allCenter)}>
          <span className={cn(align.allCenter, "text-sz-sm", "text-muted")}>
            Time (GMT)
          </span>
        </Col>
      </Row>
    )
  }
}
