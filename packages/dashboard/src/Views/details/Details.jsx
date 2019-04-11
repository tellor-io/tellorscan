import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Menu from 'Components/TopMenu';
import Overview from './overview';
import Activity from './activity';
import Search from 'Views/dashboard/MainSearch';
import {
  Row,
  Col
} from 'reactstrap';

export default class Details extends React.Component {

  /*
  <Col md="10" className={cn(align.topCenter, align.noMarginPad)}>
    <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
    */

  /*

</Row>
</Col>
  */

  render() {
    return (
      <div className={cn("details-container", align.topCenter, align.full, align.noMarginPad)}>

        <Menu withLogo/>
        <Search />
        <Row className={cn(align.allCenter, align.full, "mb-3", align.noMarginPad)}>

              <Col md="5" className={cn("overview-box", align.topCenter, align.noMarginPad)}>
                <Overview />
              </Col>
              <Col md="5" className={cn("activity-box", align.rightCenter, "pl-4", align.noMarginPad)}>
                <Activity />
              </Col>

        </Row>



      </div>
    )
  }
}
