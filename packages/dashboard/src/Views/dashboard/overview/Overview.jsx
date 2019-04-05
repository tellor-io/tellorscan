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
      <Row className={cn("overview", align.topCenter, align.full)}>
        <Col md="10" className={cn("overview-box", align.vCenter, "m-0", "p-0")}>

          <Row className={cn(align.allCenter, align.full, "m-0", "p-0")}>
              <Col md="4" className={cn("border-right", "mt-2", "mb-2", align.vCenter)}>
                <Section className="border-bottom">
                  <Price />
                </Section>
                <Section>
                  <TopApi />
                </Section>
              </Col>
              <Col md="4" className={cn("border-right", align.vCenter)}>
                <Section className="border-bottom">
                  <CurrentApi />
                </Section>
                <Section>
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
