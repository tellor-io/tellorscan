import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Price from './price';
import TopApi from './top-api';
import CurrentApi from './current-api';
import CurrentTip from './current-tip';
import Section from './Section';

export default class Overview extends React.Component {
  render() {
    return (
      <Row className={cn("overview", align.topCenter, align.full, "mt-3")}>
        <Col md="10" className={cn(align.leftCenter, "mb-1", "m-0", "p-0", "font-weight-light", "text-sz-md")}>
          Overview
        </Col>
        <Col md="10" className={cn("overview-box", align.vCenter, "m-0", "p-0")}>

          <Row className={cn(align.allCenter, align.full, "m-0", "p-0")}>
              <Col md="4" className={cn("border-right", "mt-2", "mb-2", align.vCenter)}>
                <Section className="border-bottom" icon="fa fa-globe">
                  <Price />
                </Section>
                <Section  icon="fa fa-globe">
                  <TopApi />
                </Section>
              </Col>
              <Col md="4" className={cn(align.vCenter)}>
                <Section className="border-bottom" icon="fa fa-globe">
                  <CurrentApi />
                </Section>
                <Section icon="fa fa-globe">
                  <CurrentTip />
                </Section>
              </Col>
              <Col md="4" className={cn(align.vCenter)}>
                graph
              </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
