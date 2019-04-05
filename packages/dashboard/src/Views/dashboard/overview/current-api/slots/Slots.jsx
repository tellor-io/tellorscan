import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

class Slot extends React.Component {
  render() {
    const {
      checked
    } = this.props;
    let icon = cn("fa fa-square-o", "text-muted");
    if(checked) {
      icon = cn("fa fa-check-square", "text-tellor-green");
    }
    return (
      <div className={cn(align.allCenter, align.full, "slot")}>
        <i className={cn(icon)} />
      </div>
    )
  }
}

export default class Slots extends React.Component {
  render() {
    const {
      filled
    } = this.props;

    return (
      <Row className={cn("mined-slots", "p-0", "m-0", align.topCenter, align.full)}>
        <span className={cn("ml-1", "text-muted", "text-sz-sm")}>Progress</span>
        <Col md="11" className={cn(align.allCenter)}>
          {
            filled.map((f,i)=>(
              <Slot key={i} checked={f} />
            ))
          }
        </Col>

      </Row>
    )
  }
}
