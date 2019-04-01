import React from 'react';
import ReactTable from 'react-table';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {Link} from 'react-router-dom';
import escan from 'Assets/images/etherscan_logo.png';
import {
  Row,
  Col
} from 'reactstrap';

const cols = [
  {
    Header: "Type",
    accessor: "event",
    Cell: row => {
      return  (
        <div className={cn(align.allCenter, "text-bold")}>
          <Link to={`/details/${row.value.id}`}>{row.value.type}</Link>
        </div>
      )
    }
  },
  {
    Header: "ID",
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <Link to={`/details/${row.value.id}`}>{row.value.id}</Link>
      </div>
    )
  },
  {
    Header: "Symbol",
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <Link to={`/details/${row.value.id}`}>{row.value.id}</Link>
      </div>
    )
  },
  {
    Header: "Value",
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.value}
      </div>
    )
  },
  {
    Header: "",
    accessor: "actions",
    Cell: row => (
      <div className={cn(align.allCenter, align.full)}>
          <img src={escan} width="20" height="20" alt="etherscan"/>
      </div>
    )
  }

]
export default class Streaming extends React.Component {
  render() {
    const {
      pageSize,
      events
    } = this.props;
    let rows = events.map(e=>({
      event: e
    }));
    return (
      <Row className={cn(align.topCenter, align.full, "pt-4", "pb-4")}>
        <Col md="12" className={cn(align.leftCenter, "m-0", "p-0", "font-weight-light", "text-1")}>
          Recent Mining Events
        </Col>
        <Col md="12" className={cn(align.allCenter, "m-0", "p-0")}>
          <ReactTable data={rows} columns={cols}
                      pageSize={pageSize||20}
                      noDataText="No recent mining events"
                      className="w-100 m-0 p-0 -striped -highlight" />
        </Col>
      </Row>
    )
  }
}
