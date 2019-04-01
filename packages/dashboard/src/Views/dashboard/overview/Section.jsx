import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class Section extends React.Component {
  render() {
    const {
      className,
      icon
    } = this.props;
    return (
      <Row className={cn("overview-section", className, align.leftCenter, align.full)}>
        <Col md="1" className={cn(align.leftCenter, "p-0", "m-0")}>
          <i className={cn(icon, "text-sz-md")} />
        </Col>
        <Col md="11" className={cn(align.leftCenter, "p-0")}>
          {this.props.children}
        </Col>
      </Row>
    )
  }
}
