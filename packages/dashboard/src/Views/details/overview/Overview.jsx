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
      <Row className={cn("details-overview", align.topCenter, align.full, align.noMarginPad)}>
        <General />
        <V2C />
      </Row>
    )
  }
}
