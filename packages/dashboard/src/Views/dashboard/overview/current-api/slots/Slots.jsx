import React from 'react';
import {
  Row
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

class Slot extends React.Component {
  render() {
    const {
      checked
    } = this.props;
    return (
      <div className={cn("slot", "border")}>
        {
          checked &&
          <i className={cn("fa fa-check", "text-success")} />
        }
        &nbsp;
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
      <Row className={cn("mined-slots", "p-0", "m-0", align.leftCenter, align.full)}>
        {
          filled.map((f,i)=>(
            <Slot key={i} checked={f} />
          ))
        }
        <span className={cn("ml-1", "text-muted", "text-sz-sm")}>mined slots</span>
      </Row>
    )
  }
}
