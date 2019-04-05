import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import General from './general';
import V2C from './cost';

export default class Overview extends React.Component {
  render() {
    const {
      item
    } = this.props;
    if(!item) {
      return null;
    }

    return (
      <Row className={cn("details-overview", align.topCenter, align.full, "mt-3")}>
        <Col md="10" className={cn(align.leftCenter, "mb-1", "m-0", "p-0", "font-weight-light", "text-sz-md")}>
          <span className={cn("font-weight-bold", "mr-1")}>
            API Query:
          </span>
          <span>
            {`${item.id} - ${item.symbol}`}
          </span>
        </Col>
        <Col md="10" className={cn("overview-box", align.vCenter, "m-0", "p-0")}>      <Row className={cn(align.leftCenter, align.full)}>

            <Col md="6" className={cn(align.leftCenter, "pr-1")}>
              <General />
            </Col>

            <Col md="6" className={cn(align.rightCenter, "pl-1")}>
              <V2C />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
