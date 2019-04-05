import React from 'react';
//import ReactTable from 'react-table';
import CleanTable from 'Components/CleanTable/CleanTable';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import escan from 'Assets/images/etherscan_logo.png';
import {
  Row,
  Col,
  NavLink
} from 'reactstrap';

const cols = [
  {
    Header: "ID",
    width: 1,
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <NavLink href="#" onClick={()=>row.value.actions.view(row.value.id)}>{row.value.id}</NavLink>
      </div>
    )
  },
  {
    Header: "Type",
    width: 2,
    accessor: "event",
    Cell: row => {
      return  (
        <div className={cn(align.allCenter, "text-bold")}>
          <NavLink href="#" onClick={()=>row.value.actions.view(row.value.id)}>{row.value.type}</NavLink>
        </div>
      )
    }
  },
  {
    Header: "Symbol",
    width: 4,
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <NavLink href="#" onClick={()=>row.value.actions.view(row.value.id)}>{row.value.symbol}</NavLink>
      </div>
    )
  },
  {
    Header: "Value",
    width: 4,
    accessor: "event",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.value.toFixed(4)}
      </div>
    )
  },
  {
    Header: (
      <span className={cn("text-sz-sm", "text-muted", "text-center", "font-weight-light")}>
        view on etherscan
      </span>),
    width: 1,
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
      events
    } = this.props;
    let rows = events.map(e=>({
      ...e,
      actions: {
        view: id => this.props.viewAPI(id)
      }

    }));

    return (
      <Row className={cn(align.topCenter, align.full, "p-0", "m-0")}>
        <Col md="11" className={cn("event-table-box", align.topCenter, "m-0", "p-0")}>
          <CleanTable cols={cols} data={rows} />
        </Col>
      </Row>
    )
  }
}
