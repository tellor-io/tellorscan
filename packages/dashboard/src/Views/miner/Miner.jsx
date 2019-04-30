import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Menu from 'Components/TopMenu';
import Download from './Download';
import Help from './Help';
import TopMiners from './TopMiners';
import {
  Row,
  Col
} from 'reactstrap';

export default class Miner extends React.Component {

  render() {
    const {
      miners
    } = this.props;

    return (
      <div className={cn("miner-container", align.topCenter, align.full, align.noMarginPad)}>

        <Menu withLogo title="Mining"/>
        <Row className={cn(align.allCenter, align.full, "mt-5", "mb-3", align.noMarginPad)}>

          <Col md="6" className={cn("pr-5", align.topCenter, align.noMarginPad)}>
            <Row className={cn("download-col", "rounded", "bg-white", align.topCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn("border-bottom", "border-muted", align.allCenter, align.noMarginPad)}>
                <Download downloadHandler={this.props.download}/>
              </Col>
              <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
                <Help discordHandler={this.props.discord} />
              </Col>
            </Row>
          </Col>

          <Col md="4" className={cn("top-miner-col", align.topCenter, align.noMarginPad)}>
            <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
              <Col md="12" className={cn(align.topCenter, "bg-white", align.noMarginPad)}>
                <div className={cn("open-header", "p-2", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
                  <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
                    Recent Miner Earnings
                  </span>
                </div>
              </Col>
              <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
                <TopMiners miners={miners} />
              </Col>
            </Row>
          </Col>

        </Row>


      </div>
    )
  }
}
