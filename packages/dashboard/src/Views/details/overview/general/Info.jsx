import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

const rows = [
  {
    label: "API ID",
    value: r => r.id
  },
  {
    label: "Symbol",
    value: r => r.symbol
  },
  {
    label: "Current Tip",
    value: r => r.tip
  },
  {
    label: "Multiplier",
    value: r => r.multiplier
  },
  {
    label: "API String",
    value: (r, props) => {
      let s = r.queryString;
      if(s && s.length > 60) {
        s = r.queryString.substring(0, 30) + '...' + r.queryString.substring(r.queryString.length-30);
      }
      return (
        <div className={cn(align.leftCenter, align.full)}>
          <span className={cn("text-left", "text-1", "font-weight-light", "mr-2")}>
            {s}
          </span>
          <i className={cn("fa fa-copy", "clickable-icon", "mr-2")}
             onClick={()=>props.copy(r.queryString)}/>
          <a className="hash-link"
             target="_blank"
             rel='noreferrer noopener'
             href={r.queryString}>
            <i className={cn("fa fa-external-link", "clickable-icon")} />
          </a>
        </div>
      )
    }
  }
]

const buildRow = (item, spec, idx, isLast,props) => {
  let val = null;
  let v = spec.value(item, props);
  if(typeof v !== 'object') {
    let s = (
      <span className={cn("text-center", "text-1", "font-weight-light")}>
        {v}
      </span>
    );
    val = s;
  } else {
    val = v;
  }

  let wBorder = "border-bottom";
  if(isLast) {
    wBorder= undefined;
  }
  return (
    <Row key={idx} className={cn("item-row", wBorder, align.leftCenter, align.full)}>
      <Col md="3" className={cn(align.leftCenter, "font-weight-bold")}>
        {spec.label}
      </Col>
      <Col md="9" className={cn(align.leftCenter)}>
        {val}
      </Col>
    </Row>
  )
}

export default class Info extends React.Component {
  render() {
    const {
      item
    } = this.props;
    if(!item) {
      return null;
    }

    return (
      <Row className={cn("info-container", "border", "rounded", align.topCenter, align.full, align.noMarginPad)}>
          {
              rows.map((r,i) => buildRow(item, r, i, i===rows.length-1, this.props))
          }
      </Row>
    )
  }
}
