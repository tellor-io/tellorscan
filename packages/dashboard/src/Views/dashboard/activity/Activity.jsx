import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Streaming from './streaming';
import APIinQ from './apiInQ';


/**
<Row className={cn(align.allCenter, align.full, "h-100", "p-0", "m-0")}>

  <Col md="5" className={cn("activity-box", align.topCenter, "border", "border-danger", "h-100", "p-0")}>

    <Row className={cn(align.topCenter, align.full, )}>

      <Col md="12" className={cn("activity-header", align.leftCenter,"bg-tellor-charcoal")}>

      </Col>

      <Col md="12" className={cn(align.topCenter, "bg-white")}>
        <Streaming />
      </Col>
    </Row>

  </Col>

  <Col md="5" className={cn(align.rightCenter, )}>

    <Row className={cn(align.topCenter, align.full, )}>

      <Col md="12" className={cn("activity-header", align.leftCenter,"bg-tellor-charcoal")}>
        <span className={cn("pl-3", "font-weight-bold", "text-sz-md", "text-light")}>
          Requests in Queue
        </span>
      </Col>

      <Col md="12" className={cn(align.allCenter, "bg-white")}>
        <APIinQ />
      </Col>
    </Row>

  </Col>
</Row>
*/

export default class Activity extends React.Component {
  render() {
    return (
      <Row className={cn(align.allCenter, align.full, "mb-5", "p-0", "m-0")}>
        <Col md="5" className={cn("activity-container",
                                  align.topCenter, "pr-1", "p-0", "m-0")}>
            <Row className={cn(align.topCenter, align.full, "p-0", "m-0")}>
              <Col md="12" className={cn(align.topCenter, "bg-white", "p-0", "m-0")}>
                <div className={cn("activity-header", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
                  <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
                    Streaming Mining Events
                  </span>
                </div>
              </Col>
              <Col md="12" className={cn(align.topCenter, "bg-white", "m-0", "p-0")}>
                <Streaming />
              </Col>
            </Row>
        </Col>

        <Col md="5" className={cn("activity-container",
                                  align.topCenter, "pl-1", "p-0", "m-0")}>
            <Row className={cn(align.topCenter, align.full, "p-0", "m-0")}>
              <Col md="12" className={cn(align.topCenter, "bg-white", "p-0", "m-0")}>
                <div className={cn("activity-header", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
                  <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
                    Requests in Queue
                  </span>
                </div>
              </Col>
              <Col md="12" className={cn(align.topCenter, "bg-white", "m-0", "p-0")}>
                <APIinQ />
              </Col>
            </Row>
        </Col>

      </Row>
    )
  }
}
