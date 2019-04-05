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
    Header: "Value",
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.value}
      </div>
    )
  },
  {
    Header: "Tip",
    accessor: "event",
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
          <Button outline color="warning">Dispute</Button>
      </div>
    )
  }

]

class EventTable extends React.Component {
  render() {
    const {
      pageSize,
      events
    } = this.props;

    let rows = events.map((r,i)=>({
      event: r
    }));

    console.log('rows', rows);

    return (

      <Row className={cn(align.topCenter, align.full, )}>
        <Col md="12" className={cn(align.allCenter, "m-0", "p-0")}>
          <ReactTable data={rows} columns={cols}
                      pageSize={pageSize||10}
                      noDataText="No recent events"
                      className="w-100 m-0 p-0 -striped -highlight" />
        </Col>
      </Row>
    )
  }
}

export default class Activity extends React.Component {
  render() {
    const {
      events,
      pageSize
    } = this.props;



    return (
      <Row className={cn(align.topCenter, align.full,"pt-4", "pb-4")}>
        <Col md="10" className={cn(align.leftCenter, "m-0", "p-0", "font-weight-light", "text-1")}>
          Recent Activity
        </Col>
        <Col md="10" className={cn("activity-table-container", "rounded", align.allCenter, "p-3", "m-0", "p-0")}>
          <EventTable pageSize={pageSize} events={events} />
        </Col>
      </Row>
    )
  }


}
