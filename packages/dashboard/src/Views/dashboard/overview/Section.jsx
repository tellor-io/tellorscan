import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

/*
<Col md="1" className={cn("icon-col", align.leftCenter, "p-0", "m-0")}>
  <i className={cn(icon)} />
</Col>

*/

export default class Section extends React.Component {
  render() {
    const {
      className
    } = this.props;
    return (
      <Row className={cn("overview-section", className, align.leftCenter, align.full)}>
        <Col md="12" className={cn(align.leftCenter, "p-0")}>
          {this.props.children}
        </Col>
      </Row>
    )
  }
}
