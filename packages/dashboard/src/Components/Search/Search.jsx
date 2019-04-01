import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class Search extends React.Component {
  render() {
    return (
      <Row className={cn("search-box", align.allCenter, align.full)}>

        <Col md="11" className={cn(align.leftCenter, "p-0", "m-0", "font-weight-light", "text-muted", "text-sz-md")}>

          <div className={cn("bg-light", "rounded",align.full, align.leftCenter)}>
            <span className={cn("font-weight-light", "text-muted", "m-1")}>
              Search
            </span>
            <input placeholder="api-ID" className={cn(align.full, "m-1")}/>
          </div>
        </Col>

        <Col md="1" className={cn(align.allCenter, "p-0", "m-0")}>
          <Button color="success">
            <div className={cn(align.allCenter, "p-0", "m-0", align.full)}>
              <i className={cn("fa fa-search", "mr-1")} />
              Search
            </div>
          </Button>
        </Col>
      </Row>
    )
  }
}
