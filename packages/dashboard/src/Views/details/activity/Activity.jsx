import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {formatTime} from 'Utils/time';
import ReactTable from 'react-table';

const cols = [
  {
    Header: "Time",
    accessor: "event",
    Cell: row => {
      return  (
        <div className={cn(align.allCenter, "text-bold")}>
          {formatTime(row.value.timestamp)}
        </div>
      )
    }
  },
  {
    Header: "Block",
    accessor: "event",
    Cell: row => {
      return  (
        <div className={cn(align.allCenter, "text-bold")}>
          {row.value.blockNumber}
        </div>
      )
    }
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
    Header: "Type",
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.type}
      </div>
    )
  },
  {
    Header: "",
    accessor: "actions",
    Cell: row => (
      <div className={cn(align.allCenter, align.full)}>
          <Button outline color="warning">Dispute</Button>
      </div>
    )
  }

]

export default class Activity extends React.Component {

  componentWillMount() {
    if(this.props.needsSearch && (!this.props.metadata || !this.props.metadata.id)) {
      //need to initialize
      this.props.doSearch();
    }
  }

  render() {
    const {
      loading,
      page,
      sorting,
      total,
      pageSize,
      events
    } = this.props;

    let totalPages = Math.ceil(total/pageSize);
    let rows = events.map(e=>({event: e}));

    return (
      <Row className={cn(align.topCenter, align.full,"pt-4", "pb-4")}>
        <Col md="10" className={cn(align.leftCenter, "m-0", "p-0", "font-weight-light", "text-1")}>
          Recent Activity
        </Col>
        <Col md="10" className={cn("activity-table-container", "rounded", align.allCenter, "p-3", "m-0", "p-0")}>
          <ReactTable data={rows} columns={cols}
                      defaultPageSize={pageSize}
                      pageSize={pageSize}
                      pages={totalPages}
                      page={page}
                      loading={loading}
                      manual={true}
                      defaultSorted={sorting}
                      onPageChange={this.props.nextPage}
                      onPageSizeChange={this.props.setPageSize}
                      onSortedChange={this.props.setSort}
                      noDataText="No recent events"
                      className="w-100 m-0 p-0 -striped -highlight" />
        </Col>
      </Row>
    )
  }


}
