import React from 'react';
import {
  Row,
  Col,
  Collapse,
  NavLink
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {formatTimeLong, humanizeDuration, formatDuration} from 'Utils/time';
import VoteButtons from 'Components/VoteButtons';

class DisputeInfo extends React.Component {
  render() {
    const {
      dispute,
      expanded
    } = this.props;

    let remaining = dispute.timeRemaining(dispute);
    remaining = humanizeDuration(remaining*1000);
    let v = dispute.voteCount;
    let color = "text-dark";
    let leaning = "";
    let prefix = "";
    let exIcon = expanded?"fa-caret-up":"fa-caret-down";

    if(v > 0) { color = "text-success"; prefix = "fa fa-thumbs-up"; leaning = "for disputer";}
    else if(v < 0) {color = "text-danger"; prefix = "fa fa-thumbs-down"; leaning = "against disputer"; }
    else {color = "text-dark"; prefix = "fa fa-ellipsis-h"; leaning = "neutral"}
    v = Math.abs(v);
    let tally = (
      <div className={cn(align.allCenter, color, "font-weight-bold", "text-1")}>
        <i className={cn(prefix, "text-secondary", "text-sz-sm", "mr-1")} />{v} &nbsp;
        <span className={cn(align.leftCenter,"text-muted", "font-weight-light", "text-sz-sm")}>
          {leaning}
        </span>
      </div>
    );

    return (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="1" className={cn(align.allCenter, align.noMarginPad)}>
          <NavLink href="#" onClick={()=>{
                            if(this.props.idClicked) {
                              this.props.idClicked(dispute.requestId)
                            }
                          }}
                    className={cn("font-weight-bold", "text-1", "text-left", align.noMarginPad)}>
            {dispute.requestId}
          </NavLink>
        </Col>
        <Col md="1" className={cn(align.allCenter, align.noMarginPad)}>
          <i className={cn("fa", exIcon, "text-tellor-green", "text-sz-md")}
             onClick={()=>this.props.toggleExpansion()}/>
        </Col>
        <Col md='2' className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("p-1", "text-center", "text-1")}>
            {dispute.targetNonce.winningOrder}
          </span>
        </Col>
        <Col md='2' className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("p-1", "text-center", "text-1")}>
            {dispute.targetNonce.value}
          </span>
        </Col>
        <Col md='2' className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("p-1", "text-center", "text-1")}>
            about {remaining}
          </span>
        </Col>
        <Col md='3' className={cn(align.rightCenter, align.noMarginPad)}>
          <Row className={cn(align.rightCenter, align.full, align.noMarginPad)}>
            <Col md="10" className={cn(align.leftCenter, align.noMarginPad)}>
              {tally}
            </Col>
          </Row>
        </Col>

      </Row>
    )
  }
}

const detailRows = [
  {
    label: "Query String",
    value: (r, d) => r.queryString
  },
  {
    label: "Mined at",
    value: (r, d) => formatTimeLong(d.timestamp)
  },
  {
    label: "Disputer",
    value: (r, d) => {
      return d.sender;
    }
  },
  {
    label: "Time Remaining",
    value: (r, d) => {
      let rm = d.timeRemaining(d);
      return formatDuration(rm*1000);
    }
  },
  {
    label: "Miner",
    value: (r, d) => d.miner
  }
]

class DisputeDetails extends React.Component {
  render() {
    const {
      request,
      dispute,
      canVote,
      voteReason
    } = this.props;

    let votingBody = null;
    if(canVote) {
      votingBody = (
        <React.Fragment>
          <Col md='12' className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("text-sz-sm", "text-center", "font-weight-bold", "text-dark")}>
              Agree w/ Disputer?
            </span>
          </Col>
          <Col md='12' className={cn(align.allCenter, align.noMarginPad)}>
            <VoteButtons dispute={dispute}/>
          </Col>
        </React.Fragment>
      )
    } else {
      votingBody = (
        <React.Fragment>
          <Col md='12' className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("text-sz-sm", "text-center", "font-weight-bold", "text-dark")}>
              Cannot vote
            </span>
          </Col>
          <Col md='12' className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("text-muted", "text-sz-sm", "text-center")}>
              {voteReason}
            </span>
          </Col>
        </React.Fragment>
      )
    }
    return (
      <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
        <Col md="10" className={cn(align.topCenter, align.noMarginPad)}>
          {
            detailRows.map((r,i)=>{
              let val  = r.value(request, dispute);

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
          <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
            {votingBody}
          </Row>

        </Col>
      </Row>
    )
  }
}

class DisputeBody extends React.Component {
  render() {
    const {
      expanded
    } = this.props;

    return (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="11" className={cn(align.allCenter, align.noMarginPad)}>

          <Collapse isOpen={expanded} className={cn(align.full, "mt-1", "mb-1", align.noMarginPad)}>
            <Row className={cn("border", "bg-tellor-subtle", align.topCenter, align.full, align.noMarginPad)}>

              <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
                <DisputeDetails {...this.props}/>
              </Col>
            </Row>
          </Collapse>
        </Col>
      </Row>
    )
  }
}

export default class OpenDisputeRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    [
      'toggle'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {

    return (
      <Row className={cn("open-dispute-row", "border-bottom", "border-muted", "mb-2", align.topCenter, align.full, align.noMarginPad)}>

        <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
          <DisputeInfo {...this.props} toggleExpansion={this.toggle}/>
        </Col>
        <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
          <DisputeBody {...this.props} expanded={this.state.expanded}/>
        </Col>
      </Row>
    )
  }
}
