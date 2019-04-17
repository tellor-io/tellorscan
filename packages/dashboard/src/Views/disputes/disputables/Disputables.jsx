import React from 'react';
import DisputeRow from './DisputableRow';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Loading from 'Components/Loading';

class Header extends React.Component {
  render() {
    return (
      <Row className={cn(align.allCenter, align.full, "mb-3", align.noMarginPad)}>
        <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1")}>
            ID
          </span>
        </Col>
        <Col md="10" className={cn(align.allCenter, align.noMarginPad)}>
          <span className={cn("font-weight-bold", "text-1", "mr-1")}>
            Values
          </span>
          <span className={cn("font-weight-light", "text-sz-sm", "text-muted")}>
            click for details
          </span>
        </Col>
      </Row>
    )
  }
}
export default class Disputables extends React.Component {
  constructor(props) {
    super(props);
    [
      'toggleExpansion'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  toggleExpansion(ch) {
    this.props.toggleDisputeSelection(ch);
  }

  render() {
    const {
      expandedHash,
      selectedNonce,
      challenges,
      loading
    } = this.props;


    return (
      <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
        <Loading loading={loading} />

        <Col md="12" className={cn("open-disputes-container", align.topCenter, align.noMarginPad)}>
          
          <Row className={cn(align.allCenter, align.full, "mt-2", align.noMarginPad)}>
            <Col md="12" className={cn(align.topCenter)}>
              {
                (!challenges || challenges.length === 0) &&
                  <span className={cn("pl-4", "font-weight-light", "text-sz-md", "text-dark")}>
                    No disputable values available
                  </span>
              }
              {
                challenges && challenges.length > 0 &&
                <React.Fragment>
                  <Header />
                  {
                    challenges.map((c,i)=>{
                      return (
                        <DisputeRow key={i} challenge={c}
                                    dispute={this.props.initiateDispute}
                                    expanded={expandedHash === c.challengeHash}
                                    selectedNonce={selectedNonce}
                                    selectForDispute={this.props.selectForDispute}
                                    toggleExpansion={this.toggleExpansion}
                                    idClicked={this.props.showDetails} />
                      )
                    })
                  }
                </React.Fragment>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
