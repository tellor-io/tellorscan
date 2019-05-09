import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col,
  Collapse
} from 'reactstrap';

export default class CollapseBody extends React.Component {
  render() {
    const  {
      expanded
    } = this.props;

    let mtName = "mt-2";
    let mbName = "mb-2";
    let tbMargins = {
      [mtName]: expanded,
      [mbName]: expanded
    };
    return (
      <Row className={cn(align.leftCenter, align.full, tbMargins, align.noMarginPad)}>
        <div className={cn(align.leftCenter, align.full, align.noMarginPad)}>
          <Collapse isOpen={expanded} className={cn(align.full, align.noMarginPad)}>

            {this.props.children}

          </Collapse>
        </div>
      </Row>
    )
  }
}
