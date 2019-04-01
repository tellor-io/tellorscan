import React from 'react';
import Search from 'Components/Search';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class MainSearch extends React.Component {
  render() {
    return (
      <Row className={cn(align.allCenter, align.full)}>
        <Col md="10" className={cn(align.allCenter, "search-wrapper","p-3")}>
          <Search />
        </Col>
      </Row>
    )
  }
}
