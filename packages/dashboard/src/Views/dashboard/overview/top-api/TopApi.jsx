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
import Loading from 'Components/Loading';

export default class TopApi extends React.Component {
  render() {
    const {
      topSymbol,
      topId,
      topCount,
      loading
    } = this.props;

    let tipBody = null;
    if(topSymbol && topId) {
      tipBody = (
        <React.Fragment>
          <Col md="6" className={cn(VALUE_CLASS)}>
            {topId||''} ({topSymbol || ''})
          </Col>
          <Col md="6" className={cn(align.leftCenter, align.noMarginPad)}>
            <span className={cn("text-muted", "text-left", "text-sz-sm")}>
              recent requests: {topCount}
            </span>
          </Col>
        </React.Fragment>
      )
    } else {
      tipBody = (
        <Col md="6" className={cn(VALUE_CLASS)}>
          no event history
        </Col>
      )
    }


    return (
      <Row className={cn("top-api", align.topCenter, align.full, "p-1", align.noMarginPad)}>
        <Loading loading={loading} size="small"/>

        <Col md="12" className={cn(align.leftCenter, align.full, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              <i className={cn("cui-chevron-top", "text-muted", "font-weight-light")}/>
            </Col>
            <Col md="10" className={cn(LABEL_CLASS)}>
              Top Requested ID
            </Col>
          </Row>
        </Col>
        <Col md="12" className={cn(align.leftCenter, align.full, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              &nbsp;
            </Col>
            <Col md="10" className={cn(align.leftCenter, align.noMarginPad)}>
              <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
                {tipBody}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
