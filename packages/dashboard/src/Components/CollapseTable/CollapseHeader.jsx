import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class CollapseHeader extends React.Component {
  render() {

    return (
      <Row className={cn(align.topCenter, align.full, "pt-2", "pb-4", align.noMarginPad)}>
        <div className={cn(align.topCenter, align.full, align.noMarginPad)}>

          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
              &nbsp;
            </Col>
            {this.props.children}
          </Row>
        </div>
      </Row>
    )
  }
}
