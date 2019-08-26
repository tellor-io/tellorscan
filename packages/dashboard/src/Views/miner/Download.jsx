import React from 'react';
import * as align from 'Constants/alignments';
import cn from 'classnames';
import {
  Row,
  Col,
  Button
} from 'reactstrap';

export default class Download extends React.Component {
  render() {
    return (
      <Row className={cn("download-box", align.allCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <div className={cn(align.noMarginPad, "text-center", "text-2", "font-weight-bold")}>
            Interested in mining Tellor Tributes?
          </div>
          <div className={cn("text-center", "text-1", "font-weight-light")}>
            Check out our Github for more information
          </div>
        </Col>

        <Col md="12" className={cn("pb-5", align.allCenter, align.noMarginPad)}>
          <Button onClick={()=>this.props.downloadHandler()} size="lg" className={cn("bg-tellor-green", "rounded")}>
            Miner Documentation
          </Button>
        </Col>
      </Row>
    )
  }
}
