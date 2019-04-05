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
      <Row className={cn(align.allCenter, align.full, "mt-5", 'mb-5')}>
        <Col md="10" className={cn(align.allCenter, "search-wrapper","p-3")}>
          <Row className={cn(align.topCenter, align.full, "p-3")}>
            <div className={cn(align.leftCenter, align.full, "p-0", "m-0", "text-sz-md", "text-light", "font-weight-bold")}>
              Tellorscan Oracle Explorer
            </div>
            <Search className={cn("bg-light", "rounded")}/>
          </Row>
        </Col>
      </Row>
    )
  }
}
