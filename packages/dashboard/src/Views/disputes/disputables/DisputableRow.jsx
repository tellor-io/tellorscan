import React from 'react';
import {
  Row,
  Col,
  NavLink,
  Collapse
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {formatTimeLong} from 'Utils/time';
import moment from 'moment';
import Button from 'Components/DisputeButton';
import _ from 'lodash';
import {default as dispOps} from 'Redux/disputes/operations';

const DISPUTABLE_PERIOD = 7 * 86400;

const nonceRows = [
  {
    value: (ch,n) => {
      if(ch && ch.finalValue) {
        return formatTimeLong(ch.finalValue.mineTime)
      }
      return 'unknown'
    },
    label: "Finished At"
  },
  {
    value: (ch,n) => {
      return n.miner
    },
    label: "Miner"
  },
  {
    value: (ch, n) => {
      return ch.multiplier
    },
    label: "Multiplier"
  },
  {
    value: ch => {
      let remaining = 0;
      if(ch.finalValue) {
        remaining = dispOps.timeRemaining(ch);
      } else {
        return "unknown"
      }
      //in seconds
      let m = moment.duration(remaining*1000); //.humanize();
      return `${m.hours()}h ${m.minutes()}m`;
    },
    label: "Time Remaining"
  },
  {
    value: ch => {
      return ch.queryString
    },
    label: "Query String"
  }
]

class NonceDetail extends React.Component {
  render() {
    const {
      challenge,
      nonce
    } = this.props;
    return (
      <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
        <Col md="10" className={cn(align.topCenter, align.noMarginPad)}>
          {
            nonceRows.map((r,i)=>{

              let val  = null;
              if(r.field) {
                val = challenge[r.field];
              } else if(r.value) {
                val = r.value(challenge, nonce);
              }
              return (
                <Row key={i} className={cn(align.leftCenter, align.full, "p-1", align.noMarginPad)}>
                  <Col md="3" className={cn(align.leftCenter, align.noMarginPad)}>
                    <span className={cn(align.leftCenter, "font-weight-light", "text-sz-sm")}>
                      {r.label}
                    </span>
                  </Col>
                  <Col md="9" className={cn(align.leftCenter, align.noMarginPad)}>
                    <span className={cn(align.leftCenter, "font-weight-bold", "text-sz-sm")}>
                      {val}
                    </span>
                  </Col>
                </Row>
              )
            })
          }
        </Col>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <Button challenge={challenge} nonce={nonce} onClick={()=>{this.props.dispute(challenge, nonce)}}>Dispute</Button>
        </Col>
      </Row>
    )
  }
}
class NonceCollapse extends React.Component {
  render() {
    const {
      challenge,
      nonce,
      expanded
    } = this.props;
    return(
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="11" className={cn(align.allCenter, align.noMarginPad)}>

          <Collapse isOpen={expanded} className={cn(align.full, "mt-1", "mb-1", align.noMarginPad)}>
            <Row className={cn("border", "bg-tellor-subtle", align.topCenter, align.full, align.noMarginPad)}>

              <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
                <NonceDetail dispute={this.props.dispute} nonce={nonce} challenge={challenge} />
              </Col>
            </Row>
          </Collapse>
        </Col>
      </Row>
    )
  }
}

export default class DisputableRow extends React.Component {
  constructor(props) {
    super(props);
    [
      'buildLoadingCols',
      'buildNormalCols'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  buildLoadingCols(challenge) {
    return (
      <React.Fragment>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <NavLink href="#" onClick={()=>{
                            if(this.props.idClicked) {
                              this.props.idClicked(challenge.id)
                            }
                          }}
                    className={cn("font-weight-bold", "text-1", "text-left", align.noMarginPad)}>
            {challenge.id}
          </NavLink>
        </Col>
        <Col md="10" className={cn(align.allCenter, align.full, align.noMarginPad)}>
          <i className={cn("fa fa-spin fa-spinner", "text-sz-md")} />
        </Col>
      </React.Fragment>
    )
  }

  buildNormalCols(challenge) {

    let nonces = _.values(challenge.nonces) || [];
    nonces.sort((a,b)=>a.winningOrder-b.winningOrder);

    let exIcon = this.props.expanded?"fa-caret-up":"fa-caret-down";
    return (
      <React.Fragment>
        <Col md="1" className={cn(align.allCenter, align.noMarginPad)}>
          <NavLink href="#" onClick={()=>{
                            if(this.props.idClicked) {
                              this.props.idClicked(challenge.id)
                            }
                          }}
                    className={cn("font-weight-bold", "text-1", "text-left", align.noMarginPad)}>
            {challenge.id}
          </NavLink>
        </Col>
        <Col md="1" className={cn(align.allCenter, align.noMarginPad)}>
          <i className={cn("fa", exIcon, "text-tellor-green", "text-sz-md")}
             onClick={()=>this.props.toggleExpansion(challenge)}/>
        </Col>
        {
          nonces.map((n,i)=>{
            let selected = this.props.selectedNonce === n && this.props.expanded;
            let borderClass = selected?"border border-dark":undefined;
            return (
              <Col key={i} md='2' className={cn(align.leftCenter, align.noMarginPad)}>
                <span onClick={()=>{
                  this.props.selectForDispute(challenge, n)
                }}
                      className={cn("value-tab", "p-1", "rounded", "text-center", "text-1", {["bg-tellor-muted"]: selected}, borderClass)}>
                  {n.value}
                </span>
              </Col>
            )
          })
        }

      </React.Fragment>
    )
  }


  render() {
    const {
      challenge,
      expanded
    } = this.props;
    let loading = !challenge.finalValue;
    let selNonce = this.props.selectedNonce || {};
    let details = (
      <NonceCollapse dispute={this.props.dispute} challenge={challenge} nonce={selNonce} expanded={expanded} />
    )

    return (
      <Row className={cn("dispute-row", "border-bottom", "border-muted", "mb-2", align.topCenter, align.full, align.noMarginPad)}>

        <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
          <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
            {
              (loading || (!challenge.nonces || !challenge.finalValue)) &&
              this.buildLoadingCols(challenge)
            }
            {
              !loading &&
              this.buildNormalCols(challenge)
            }
          </Row>
        </Col>
        {
          challenge.finalValue &&
          <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
            {details}
          </Col>
        }
      </Row>
    )
  }
}
