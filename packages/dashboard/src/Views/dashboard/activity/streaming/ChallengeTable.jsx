import React from 'react';
import ChallengeViewer from 'Components/ChallengeViewer/ChallengeViewer';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import escan from 'Assets/images/etherscan_logo.png';
import {
  Row,
  Col
} from 'reactstrap';
import Loading from 'Components/Loading';

export default class ChallengeTable extends React.Component {
  render() {
    const {
      challenges,
      loading
    } = this.props;

    return (
      <Row className={cn(align.topCenter, align.full, "p-0", "m-0")}>
        <Loading loading={loading} />
        <Col md="11" className={cn("event-table-box", align.topCenter, "m-0", "p-0")}>
          <ChallengeViewer challenges={challenges} idClicked={this.props.viewDetails}/>
        </Col>
      </Row>
    )
  }
}
