import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col,
  Badge
} from 'reactstrap';
import {formatTimeLong} from 'Utils/time';
import CleanTable from 'Components/CleanTable/CleanTable';
import Loading from 'Components/Loading';

const cols = [

  {
    Header: "Request ID",
    width: 1,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "font-weight-light", "text-1")}>
        {row.value.id}
      </div>
    )
  },
  {
    Header: "Mined At",
    width: 2,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "font-weight-light", "text-sz-sm")}>
        {formatTimeLong(row.value.timestamp)}
      </div>
    )
  },
  {
    Header: "Multi",
    width: 1,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "font-weight-light", "text-1")}>
        {row.value.multiplier}
      </div>
    )
  },
  {
    Header: "Value",
    width: 2,
    accessor: "item",
    Cell: row => {
      let v = row.value.value;

      return (
        <div className={cn(align.allCenter, "font-weight-light", "text-1")}>
          <Badge className={cn("bg-tellor-green", "text-dark", "p-2")}>
            {v}
          </Badge>
        </div>
      )
    }
  },
  {
    Header: "Time Left",
    width: 2,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "font-weight-light", "text-1")}>
        {row.value.timeLeft}
      </div>
    )
  },
  {
    Header: "Tally",
    width: 2,
    accessor: "item",
    Cell: row => {
      let v = row.value.tally;
      let color = "text-dark";
      let leaning = "";
      let prefix = "";
      if(v > 0) { color = "text-success"; prefix = "+"; leaning = "agree w/miner";}
      else if(v < 0) {color = "text-danger"; prefix = "-"; leaning = "disagree w/miner"; };

      return (
        <div className={cn(align.allCenter, color, "font-weight-bold", "text-1")}>
          {prefix + v} &nbsp;
          <span className={cn(align.leftCenter,"text-muted", "font-weight-light", "text-sz-sm")}>
            {leaning}
          </span>
        </div>
      )
  }
  },
  {
    Header: "Vote",
    width: 2,
    accessor: "item",
    Cell: row => (
      <div className={cn(align.allCenter, "font-weight-light", "text-1")}>
        <i className={cn("fa fa-thumbs-up", "mr-2")} />
        <i className={cn("fa fa-thumbs-down")} />
      </div>
    )
  }

]

export default class Pending extends React.Component {
  render() {
    const {
      disputes,
      loading
    } = this.props;
    if(!disputes || disputes.length === 0) {
      return (
        <Row className={cn("dispute-container", align.topCenter, align.full, align.noMarginPad)}>
          <Col md="11" className={cn("open-disputes-container", align.topCenter, align.noMarginPad)}>
            <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn("open-header", "p-2", "bg-tellor-charcoal", "text-white", align.leftCenter, align.noMarginPad)}>
                <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
                  Open Disputes
                </span>
              </Col>
            </Row>
            <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
                <span className={cn("pl-4", "font-weight-light", "text-sz-md", "text-dark")}>
                  No open disputes
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    }

    let rows = disputes.map(e=>({
      ...e,
      actions: {
        vote: (id,dir) => this.props.vote(id,dir)
      }
    }));
    return (
      <Row className={cn("dispute-container", align.topCenter, align.full, align.noMarginPad)}>
        <Loading loading={loading} />

        <Col md="12" className={cn("open-disputes-container", align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="12" className={cn("open-header", "bg-tellor-charcoal", "text-white", align.leftCenter, align.noMarginPad)}>
              <span className={cn("font-weight-bold", "text-sz-md", "text-light")}>
                Open Disputes
              </span>
            </Col>
          </Row>
          <Row className={cn(align.leftCenter, align.full, "mt-2", align.noMarginPad)}>
            <Col md="12" className={cn(align.leftCenter)}>
              <CleanTable cols={cols} data={rows} />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
