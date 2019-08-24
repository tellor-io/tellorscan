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
      data
    } = this.props;

    return (
      <Row className={cn("cost-chart-wrapper", "pt-3", "pb-3", align.topCenter, align.full, align.noMarginPad)}>
        <Loading loading={loading} />
        <div className={cn(align.allCenter, align.full, align.noMarginPad)}>
          Recent Request Tips
        </div>
        <div className={cn("chart", align.full, align.allCenter, align.noMarginPad)}>
          <Chart data={data} />
        </div>
        <div className={cn("chart", align.full, align.allCenter, align.noMarginPad)}>
          <span className={cn(align.allCenter, "text-sz-sm", "text-muted")}>
            Block
          </span>
        </div>
      </Row>
    )
  }
}
