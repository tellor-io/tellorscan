import React from 'react';
import _ from 'lodash';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col
} from 'reactstrap';
import {fixLength} from 'Utils/strings';

class NonceRow extends React.Component {
  render() {
    const {
      disputable,
      nonce,
      idx
    } = this.props;
    let isMedian = nonce.winningOrder === 2;
    let bgColor = idx%2===0?"bg-tellor-subtle":"";
    let dIcon = null;
    if(disputable){
      dIcon = (
        <i onClick={()=>this.props.dispute(idx)}
           className={cn("fa fa-thumbs-down", "clickable-icon", "text-tellor-green")} />
      );
    } else {
      dIcon = (
        <span className={cn("text-muted", "text-sz-sm", "font-weight-light")}>
          Final
        </span>
      )
    }

    return (
      <Row className={cn(bgColor, align.leftCenter, align.full, align.noMarginPad)}>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          {
            isMedian &&
            <span className={cn(align.allCenter, align.full, "text-muted", "text-sz-sm", "text-right", "pr-1")}>
              median
            </span>
          }
        </Col>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>

          <span className={cn(align.allCenter, "p-1", "text-sz-sm", "rounded", "font-weight-light", isMedian?"bg-secondary text-light":"")}>
            {nonce.value.toFixed(2)}
          </span>
        </Col>

        <Col md="6" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn(align.allCenter, "p-1", "text-sz-sm", "rounded", "font-weight-light")}>
            {fixLength(nonce.miner, 30)}
          </span>
        </Col>

        <Col md="2" className={cn("pr-5", align.rightCenter, align.noMarginPad)}>
          {dIcon}
        </Col>
      </Row>
    )
  }
}
export default class ChallengeBody extends React.Component {
  render() {
    const  {
      challenge
    } = this.props;
    let dFn = challenge.isDisputable;
    let disputable = dFn?dFn(challenge):true;
    let nonces = _.values(challenge.nonces);
    nonces.sort((a,b)=>a.winningOrder-b.winningOrder);

    return (
      <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
        <div className={cn("bg-tellor-charcoal", align.full, align.leftCenter, align.noMarginPad)}>
          <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
            <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>

            </Col>
            <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
              <span className={cn("text-center", "text-light", "font-weight-light", "text-1")}>
                Values
              </span>
            </Col>
            <Col md="6" className={cn(align.allCenter, align.noMarginPad)}>
              <span className={cn("ml-1", "text-center", "text-light", "font-weight-light", "text-1")}>
                Miner
              </span>
            </Col>
            <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
              <span className={cn("pr-4", "text-center", "text-light", "font-weight-light", "text-1")}>
                Dispute
              </span>
            </Col>
          </Row>
        </div>
        <div className={cn(align.topCenter, align.full, align.noMarginPad)}>
          {
            nonces.map((n,i)=>{

              return (
                <NonceRow dispute={(idx)=>this.props.dispute(challenge, n)} nonce={n} idx={i} key={i} disputable={disputable}/>
              )
            })
          }
        </div>
      </Row>
    )
  }
}
