import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Chart from 'Views/dashboard/overview/costs/Costs';

export default class ValueToCost extends React.Component {
  render() {
    const {
      loading,
      data
    } = this.props;

    return (
      <Row className={cn("cost-container", "border", "rounded", "mt-4",  align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.noMarginPad)}>
          <Chart data={data} loading={loading} height={250}/>
        </Col>
      </Row>
    )
  }
}
