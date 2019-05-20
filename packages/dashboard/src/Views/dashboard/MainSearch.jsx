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
    let {
      loading,
      title
    } = this.props;
    if(!title) {
      title = "Tellorscan Oracle Explorer";
    }
    return (
      <Row className={cn(align.allCenter, align.full, "mt-5", 'mb-5')}>
        <Col md="10" className={cn(align.allCenter, "pr-4", "pl-4", "search-wrapper")}>
          <Row className={cn(align.topCenter, align.full, "text-and-search")}>
            <div className={cn(align.leftCenter, align.full, "p-0", "m-0", "text-sz-md", "text-light", "font-weight-bold")}>
              {title}
            </div>
            <Search loading={loading} {...this.props} className={cn("bg-light", "rounded")}/>
          </Row>
        </Col>
      </Row>
    )
  }
}
