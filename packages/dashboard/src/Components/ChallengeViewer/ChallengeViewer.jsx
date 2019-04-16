import React from 'react';
import {
  Row,
  Col,
  NavLink
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Progress from './ChallengeProgress';
import Body from './ChallengeBody';
import Value from './ChallengeValue';
import {
  formatTimeLong
} from 'Utils/time';
import CollapseTable from 'Components/CollapseTable/CollapseTable';

class ChallengeHeader extends React.Component {
  render() {
    const {
      hideSymbol,
      hideId
    } = this.props;

    return (
        <React.Fragment>
          {
            !hideId &&
            <Col md="1" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
              <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                ID
              </span>
            </Col>
          }

          {
            !hideSymbol &&
            <Col md="2" className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
              <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
                Symbol
              </span>
            </Col>
          }


          <Col md="2" className={cn(align.allCenter, "ml-1", align.noMarginPad)}>
            <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
              Value
            </span>
          </Col>



          <Col  className={cn(align.allCenter, "ml-auto", "mr-auto", align.noMarginPad)}>
            <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
              Progress
            </span>
          </Col>

          <Col md="2" className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("font-weight-bold", "text-sz-sm", "text-center")}>
              Tip
            </span>
          </Col>
        </React.Fragment>
    )
  }
}

export default class ChallengeViewer extends CollapseTable {
  constructor(props) {
    super(props);
    [
      'buildHeader',
      'buildBody',
      '_buildPrimaryFields',
      '_buildTimestampField'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  buildHeader(data) {
    return (
      <ChallengeHeader hideId={this.props.noId} hideSymbol={this.props.noSymbol}/>
    )
  }

  buildBody(data) {
    return (<Body dispute={this.props.dispute} challenge={data} />)
  }

  buildFieldRows(data) {
    //must return 2 rows. One for main fields and one for timestamp
    let rows = [
      this._buildPrimaryFields(data),
      this._buildTimestampField(data)
    ];

    return rows;
  }

  _buildPrimaryFields(data) {
    let fields = [];
    if(!this.props.noId) {
      fields.push({
        width: 1,
        component: (
          <NavLink href="#" onClick={()=>{
                            if(this.props.idClicked) {
                              this.props.idClicked(data.id)
                            }
                          }}
                    className={cn("font-weight-bold", "text-1", "text-left", align.noMarginPad)}>
            {data.id}
          </NavLink>
        )
      })
    }
    if(!this.props.noSymbol) {
      fields.push({
        width: 2,
        component: (
          <span className={cn("font-weight-bold", "text-1")}>
            {data.symbol}
          </span>
        )
      })
    }
    fields.push({
      width: 2,
      component: (<Value challenge={data} />)
    });
    fields.push({
      //no width
      className: "ml-auto",
      component: (
        <Progress challenge={data} />
      )
    });
    fields.push({
      width: 2,
      component: (
        <span className={cn(align.full, "font-weight-light", "text-1", "text-center")}>
          {data.tip}
        </span>
      )
    });
    return {
      data: fields
    }
  }

  _buildTimestampField(data) {
    return {
      data: [
        {
          width: 10,
          component: (
            <React.Fragment>
              <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
                <span className={cn("text-muted", "font-weight-light", "text-1")}>
                  Time
                </span>
              </Col>
              <Col md="12" className={cn(align.leftCenter, align.noMarginPad)}>
                <span className={cn(align.noMarginPad,"text-muted", "text-left", "font-weight-light", "text-1")}>
                  {formatTimeLong(data.timestamp)}
                </span>
              </Col>
            </React.Fragment>
          )
        }
      ]
    }
  }
}
