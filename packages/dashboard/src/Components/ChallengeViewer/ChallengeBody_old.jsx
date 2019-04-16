import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  Row,
  Col,
  Collapse
} from 'reactstrap';

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
      dIcon = (<i className={cn("fa fa-thumbs-down", "clickable-icon", "text-warning")} />);
    } else {
      dIcon = (
        <span className={cn("text-muted", "text-sz-sm", "font-weight-light")}>
          Final
        </span>
      )
    }

    return (
      <Row className={cn(bgColor, align.leftCenter, align.full, align.noMarginPad)}>
        <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
          {
            isMedian &&
            <span className={cn(align.leftCenter, "text-muted", "text-sz-sm")}>
              median
            </span>
          }
        </Col>
        <Col md="2" className={cn(align.leftCenter, align.noMarginPad)}>

          <span className={cn(align.leftCenter, "p-1", "text-sz-sm", "font-weight-light", isMedian?"bg-tellor-green":"")}>
            {nonce.value.toFixed(2)}
          </span>
        </Col>

        <Col md="8" className={cn(align.rightCenter, align.noMarginPad)}>
          {dIcon}
        </Col>
      </Row>
    )
  }
}
export default class ChallengeBody extends React.Component {
  render() {
    const  {
      challenge,
      expanded
    } = this.props;
    let dFn = challenge.isDisputable;
    let disputable = dFn?dFn():true;

    let mtName = "mt-2";
    let mbName = "mb-2";
    let tbMargins = {
      [mtName]: expanded,
      [mbName]: expanded
    };
    return (
      <Row className={cn(align.leftCenter, align.full, tbMargins, align.noMarginPad)}>
        <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
          <Collapse isOpen={expanded} className={cn(align.full, align.noMarginPad)}>

            <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn("bg-tellor-charcoal", align.leftCenter, align.noMarginPad)}>
                <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
                  <Col md="6" className={cn(align.leftCenter, align.noMarginPad)}>
                    <span className={cn("ml-1", "text-left", "text-light", "font-weight-light", "text-1")}>
                      Miner Submissions
                    </span>
                  </Col>
                  <Col md="6" className={cn(align.rightCenter, align.noMarginPad)}>
                    <span className={cn("pr-4", "text-center", "text-light", "font-weight-light", "text-1")}>
                      Dispute
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
                {
                  challenge.nonces.map((n,i)=>{

                    return (
                      <NonceRow nonce={n} idx={i} key={i} disputable={disputable}/>
                    )
                  })
                }
              </Col>
            </Row>

          </Collapse>
        </Col>
      </Row>
    )
  }
}
