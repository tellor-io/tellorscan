import React from 'react';
import * as align from 'Constants/alignments';
import cn from 'classnames';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import discord from 'Assets/images/Discord-Logo-Color.svg';

export default class Help extends React.Component {
  render() {
    return (
      <Row className={cn( align.allCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <div className={cn(align.noMarginPad, "text-center", "text-sz-md", "font-weight-bold")}>
            Need help getting started?
          </div>
          <div className={cn("text-center", "text-1", "font-weight-light")}>
            Hop into our #mining chatroom in our Discord Channel
          </div>
        </Col>

        <Col md="12" className={cn("pt-5", align.allCenter, align.noMarginPad)}>
          <img src={discord} width="75" height="75" alt="discord" />
        </Col>
      </Row>
    )
  }
}
