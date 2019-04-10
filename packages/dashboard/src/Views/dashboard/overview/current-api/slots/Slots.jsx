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
      pending,
      filled
    } = this.props;

    return (
      <Row className={cn("mined-slots", align.noMarginPad, align.topCenter, align.full)}>
        <div className={cn("ml-1", align.allCenter, align.noMarginPad, align.full)}>
          <span className={cn("mr-1", align.noMarginPad, "text-muted", "text-sz-sm")}>Progress</span>
          {
            pending &&
            <i className={cn("spinner","fa", "fa-spin", "fa-spinner")} style={{fontSize: "1.2em"}}/>
          }
        </div>
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
