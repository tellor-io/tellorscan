import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import * as align from 'Constants/alignments';
import cn from 'classnames';
import {humanizeTellor} from 'Utils/token';
import {fixLength} from 'Utils/strings';
import {formatTimeLong} from 'Utils/time';

class Header extends React.Component {
  render() {
    return (
      <Row className={cn("pt-1", 'pb-3', align.allCenter, align.full, align.noMarginPad)}>
        <Col md="8" className={cn(align.leftCenter, align.noMarginPad)}>
          <span className={cn("text-left", "text-sz-sm", "font-weight-bold")}>
            Address
          </span>
        </Col>
        <Col md="2" className={cn(align.rightCenter, align.noMarginPad)}>
          <span className={cn("text-right", "text-sz-sm", "font-weight-bold")}>
            TRB
          </span>
        </Col>
      </Row>
    )
  }
}
class MinerDetails extends React.Component {
  render() {
    const {
      miner
    } = this.props;
    return (
      <Row className={cn("detail", "border-bottom", "border-muted", "mb-2", align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
            <Col md="8" className={cn(align.leftCenter, align.noMarginPad)}>
              <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
                <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
                  <span className={cn("text-left", "text-1", "font-weight-light")}>
                    {fixLength(miner.address, 30)}
                  </span>
                </Col>
                <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
                  <span className={cn("text-left", "text-1", "font-weight-light")}>
                    Last mined at: {formatTimeLong(miner.lastMineTime)}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col md="2" className={cn(align.rightCenter, align.noMarginPad)}>
              <span className={cn("text-right", "text-1", "font-weight-bold")}>
                {humanizeTellor(miner.balance)}
              </span>
            </Col>
          </Row>
        </Col>

      </Row>
    )
  }
}

export default class TopMiners extends React.Component {
  render() {
    const {
      miners
    } = this.props;

    return (
      <Row className={cn("top-container", "bg-white",align.topCenter, align.full, align.noMarginPad)}>
        <Header />
        {
          miners.map((m,i)=>{
            return (
              <Col key={i} md="12" className={cn(align.allCenter, align.noMarginPad)}>
                <MinerDetails idx={i} miner={m}/>
              </Col>
            )
          })
        }
      </Row>
    )
  }
}
