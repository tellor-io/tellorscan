import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Menu from 'Components/TopMenu';
import Search from 'Views/dashboard/MainSearch';
import Pending from './pending';
import Disputable from './disputables';
import {
  Row,
  Col
} from 'reactstrap';

export default class Details extends React.Component {

  render() {
    return (
      <div className={cn("details-container", align.topCenter, align.full, align.noMarginPad)}>

        <Menu withLogo title="Disputes"/>
        <Search title="Filter Disputes" resultHandler={r=>this.props.filterDisputes(r?r.id:"")}/>
        <Row className={cn(align.allCenter, align.full, "mb-3", align.noMarginPad)}>

          <Col md="5" className={cn("pr-3", align.topCenter, align.noMarginPad)}>
            <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn(align.topCenter, "bg-white", align.noMarginPad)}>
                <div className={cn("open-header", "p-2", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
                  <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
                    Disputable Values
                  </span>
                </div>
              </Col>
              <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
                <Disputable />
              </Col>
            </Row>
          </Col>
          <Col md="5" className={cn(align.topCenter, align.noMarginPad)}>
            <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn(align.topCenter, "bg-white", align.noMarginPad)}>
                <div className={cn("open-header", "p-2", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
                  <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
                    Open Disputes
                  </span>
                </div>
              </Col>
              <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
                <Pending />
              </Col>
            </Row>
          </Col>

        </Row>


      </div>
    )
  }
}
