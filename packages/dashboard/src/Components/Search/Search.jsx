import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class Search extends React.Component {
  render() {
    const {
      className
    } = this.props;

    return (
      <Row className={cn( "search-box", className, align.allCenter, align.full, "p-1")}>

        <Col md="12" className={cn(align.leftCenter, "p-0", "m-0", "font-weight-light", "text-muted", "text-sz-md")}>

          <div className={cn("rounded",align.full, align.leftCenter)}>
            <i className={cn("search-icon fa fa-search", "m-0", "bg-tellor-green")} />
            <input placeholder="api-ID" className={cn(align.full, "m-0")}/>

          </div>
        </Col>

      </Row>
    )
  }
}
