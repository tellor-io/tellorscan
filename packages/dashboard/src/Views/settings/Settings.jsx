import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

import Menu from 'Components/TopMenu';


class HistorySettings extends React.Component {
  constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
  }

  clear() {
    let msg = "Clearing local history will remove all event stream data and " +
              "force a clean sync with on-chain data. Syncing can take several " +
              "minutes depending on network performance. Are you sure you want " +
              "to clear local history?";
    if(window.confirm(msg)) {
      this.props.clearHistory();
    }
  }

  render() {
    return (
      <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.leftCenter, "pl-1", align.noMarginPad, "bg-tellor-charcoal", "text-sz-md", "text-light", "font-weight-bold")}>
          History
        </Col>
        <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
          <Row className={cn(align.allCenter, align.full, "bg-light", "p-3", "p-0", "m-0")}>

            <Col md="6" className={cn(align.leftCenter, "m-0", "p-0")}>
              <span className={cn("text-left")}>
                 Clear local history and sync only with last 50 payout items on-chain
              </span>
            </Col>
            <Col md="6" className={cn(align.rightCenter, "m-0", "p-0")}>
              <Button outline size="sm" onClick={this.clear}>
                Clear
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default class Settings extends React.Component {
  render() {

    return (
      <div className={cn("settings-container", align.topCenter, align.full)}>
        <Menu withLogo title="Settings"/>
        <Row className={cn(align.allCenter, align.full)}>
          <Col md="8" className={cn(align.topCenter)}>
            <Row className={cn(align.topCenter, align.full)}>

              <Col md="12" className={cn(align.leftCenter, "mt-3", "mb-3", align.noMarginPad, "border-bottom", "border-muted")}>
                <HistorySettings {...this.props} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
