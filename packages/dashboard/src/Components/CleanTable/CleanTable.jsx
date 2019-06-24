import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';


class RowHeader extends React.Component {
  render() {
    const {
      cols
    } = this.props;
    if(!cols || cols.length === 0) {
      return null;
    }
    if(cols.length > 12) {
      throw new Error("Max 12 columns allowed in table");
    }

    let defWidth = Math.ceil(12/cols.length);
    return (
      <Row className={cn( align.allCenter, align.full, "m-0", "p-0","pt-2")}>
        {
          cols.map((c, i)=>{
            let body = null;
            if(typeof c.Header === 'string') {
              body = (
                <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                  {c.Header}
                </span>
              )
            } else {
              body = c.Header;
            }
            return (
              <Col key={i} md={c.width||defWidth} className={cn(align.allCenter, "m-0", "p-0")}>
                {body}
              </Col>
            )
          })
        }
      </Row>
    )
  }
}

class EventRow extends React.Component {
  render() {
    const {
      item,
      cols,
    } = this.props;
    if(!cols || cols.length === 0) {
      return null;
    }
    if(cols.length > 12) {
      throw new Error("Max 12 columns allowed in table");
    }

    let defWidth = Math.ceil(12/cols.length);
    return (
      <Row className={cn("item-row", "border-bottom", "border-muted", align.allCenter, align.full, "m-0", "p-0")}>
        {
          cols.map((c, i)=>{
            let body = null;
            if(c.Cell) {
              body = c.Cell({value:item});
            } else if(c.accessor) {
              body = (<span className={cn(align.allCenter)}>{item[c.accessor]}</span>)
            }
            if(!body) {
              throw new Error("Column needs an accessor or custom Cell function to render column value: " + c.Header);
            }
            return (
              <Col key={i} md={c.width||defWidth} className={cn(align.allCenter, "m-0", "p-0")}>
                {body}
              </Col>
            )
          })
        }
      </Row>
    )
  }
}


export default class CleanTable extends React.Component {
  render() {
    const {
      data,
      cols,
      className
    } = this.props;
    if(!Array.isArray(data)) {
      throw new Error("Must provide a data array for rows");
    }

    return (
      <Row className={cn(className, align.topCenter, align.full, "p-0", "m-0")}>
        <Col md="11" className={cn("table-box", align.topCenter, "m-0", "p-0")}>
          <RowHeader cols={cols}/>
          {
            data.map((r,i)=>{
              return (
                <EventRow key={i} cols={cols} item={r} />
              )
            })
          }
        </Col>
      </Row>
    )

  }
}
