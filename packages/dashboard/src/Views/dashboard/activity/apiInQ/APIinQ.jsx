import React from 'react';
import ReactTable from 'react-table';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {Link} from 'react-router-dom';
import {
  Row,
  Col
} from 'reactstrap';

const cols = [

  {
    Header: "ID",
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <Link to={`/details/${row.value.id}`}>{row.value.id}</Link>
      </div>
    )
  },
  {
    Header: "Symbol",
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <Link to={`/details/${row.value.id}`}>{row.value.id}</Link>
      </div>
    )
  },
  {
    Header: "Tip",
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.tip}
      </div>
    )
  },
  {
    Header: "",
    accessor: "actions",
    Cell: row => (
      <div className={cn(align.allCenter, align.full)}>
          <i className={cn("circle-button fa fa-plus")} />
      </div>
    )
  }

]
export default class Streaming extends React.Component {
  render() {
    const {
      pageSize,
      onQ
    } = this.props;
    let rows = onQ.map(e=>({
      item: e
    }));
    return (
      <Row className={cn(align.topCenter, align.full, "pt-4", "pb-4")}>
        <Col md="12" className={cn(align.leftCenter, "m-0", "p-0", "font-weight-light", "text-1")}>
          APIs in Queue
        </Col>
        <Col md="12" className={cn(align.allCenter, "m-0", "p-0")}>
          <ReactTable data={rows} columns={cols}
                      pageSize={pageSize||20}
                      noDataText="No recent queued requests"
                      className="w-100 m-0 p-0 -striped -highlight" />
        </Col>
      </Row>
    )
  }
}
