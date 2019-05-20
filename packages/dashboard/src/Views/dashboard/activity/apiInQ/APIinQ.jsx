import React from 'react';
import CleanTable from 'Components/CleanTable/CleanTable';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col,
  NavLink
} from 'reactstrap';
import Loading from 'Components/Loading';
import AddTip from 'Components/AddTipButton';
import TipModal from 'Views/dashboard/modals/tip';

const cols = [

  {
    Header: "ID",
    width: 1,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        <NavLink href="#" onClick={()=>row.value.actions.view(row.value.id)}>{row.value.id}</NavLink>
      </div>
    )
  },
  {
    Header: "Symbol",
    width: 4,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.symbol}
      </div>
    )
  },
  {
    Header: "Tip",
    width: 5,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "text-bold")}>
        {row.value.currentTip}
      </div>
    )
  },
  /*
  <div className={cn(align.allCenter, align.full)}>
      <i className={cn("circle-button fa fa-plus", "text-tellor-green")}
        onClick={()=>row.value.actions.increment(row.value.id)}/>
  </div>
  */
  {
    Header: (
      <span className={cn("text-sz-sm", "text-muted", "text-center", "font-weight-light")}>
        add tip
      </span>),
    width: 1,
    accessor: "item",
    Cell: row => (
      <AddTip onClick={()=>row.value.actions.increment(row.value.id)} />

    )
  }

]
export default class APIInQ extends React.Component {
  render() {
    const {
      onQ,
      loading
    } = this.props;
    let rows = onQ.map(e=>({
      ...e,
      actions: {
        view: id => this.props.viewAPI(id),
        increment: id => this.props.addTip(id, 1)
      }
    }));
    return (
      <Row className={cn("request-container", align.topCenter, align.full, "p-0", "m-0")}>
        <Loading loading={loading} />
        <TipModal />
        <Col md="11" className={cn("api-table-box", align.topCenter, "m-0", "p-0")}>
          <CleanTable cols={cols} data={rows} />
        </Col>
      </Row>
    )
  }
}
