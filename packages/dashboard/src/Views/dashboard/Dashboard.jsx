import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Menu from 'Components/TopMenu';
import Search from './MainSearch';
import Overview from './overview';
import Activity from './activity';
import ReqData from './modals/requestData';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div className={cn("dashboard-container", align.topCenter, align.full)}>
        <ReqData />
        
        <Menu withLogo title="Dashboard"/>
        <Search />
        <Overview />
        <Row className={cn(align.allCenter, align.full, "mb-4", "mt-4")}>
          <Col md="5" className={cn("request-button-wrapper", align.allCenter, "p-2")}>
            <Button size="lg"
                    className={cn("request-button")}
                    onClick={()=>this.props.requestData()}>Request Data</Button>
          </Col>
        </Row>
        <Activity />
      </div>
    )
  }
}
