import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Slots from './slots';
import {
  LABEL_CLASS,
  VALUE_CLASS
} from 'Views/dashboard/overview/common';
import Loading from 'Components/Loading';

/*

  */

export default class CurrentApi extends React.Component {
  render() {
    const {
      current,
      loading
    } = this.props;
    let idText = null;
    if(current) {
      idText = `${current.id} (${current.symbol})`;
    } else {
      idText = "no pending requests";
    }

    return (
      <Row className={cn("current-api", align.leftLeft, align.full, align.noMarginPad)}>
        <Loading loading={loading} size="small"/>
        <Col md="9" className={cn( align.topCenter, "m-0", "p-0")}>

          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              <i className={cn("icon-link", "text-muted", "font-weight-light")}/>
            </Col>
            <Col md="9" className={cn(LABEL_CLASS)}>
              Current Request ID
            </Col>
          </Row>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              &nbsp;
            </Col>
            <Col md="9" className={cn(VALUE_CLASS)}>
              {idText}
            </Col>
          </Row>

        </Col>

        <Col md="3" className={cn(align.rightCenter, align.noMarginPad)}>

          <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
            <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
              <Slots />
            </Col>
          </Row>

        </Col>
      </Row>
    )
  }
}
