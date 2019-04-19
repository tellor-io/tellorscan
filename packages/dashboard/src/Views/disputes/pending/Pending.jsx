import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col
} from 'reactstrap';
import Loading from 'Components/Loading';
import DRow from './OpenDisputeRow';

class Header extends React.Component {
  render() {
    return (
      <Row className={cn(align.allCenter, align.full, "pb-3", align.noMarginPad)}>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1", "text-center")}>
            ID
          </span>
        </Col>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1", "text-center")}>
            Index
          </span>
        </Col>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1", "text-center")}>
            Value
          </span>
        </Col>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1", "text-center")}>
            Time left
          </span>
        </Col>
        <Col md="3" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1", "text-center")}>
            Tally
          </span>
        </Col>

      </Row>
    )
  }
}

export default class Pending extends React.Component {
  render() {
    const {
      disputes,
      loading
    } = this.props;
    if(!disputes || disputes.length === 0) {
      return (
        <Row className={cn("dispute-container", align.topCenter, align.full, align.noMarginPad)}>
          <Col md="12" className={cn("open-disputes-container", align.topCenter, align.noMarginPad)}>

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

          <Row className={cn(align.leftCenter, align.full, "mt-2", align.noMarginPad)}>
            <Col md="12" className={cn(align.topCenter)}>
              <Header />

              {
                rows.map((r,i)=>{
                  return (
                    <DRow key={i}
                          idClicked={this.props.viewRequestDetails}
                          dispute={r}
                          canVote={r.canVote}
                          voteReason={r.voteReason}
                          request={r.request} />
                  )
                })
              }

            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
