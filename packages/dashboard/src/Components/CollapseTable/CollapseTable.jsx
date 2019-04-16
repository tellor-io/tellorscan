import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Header from './CollapseHeader';
import Body from './CollapseBody';

class Controls extends React.Component {
  render() {
    const {
      expanded
    } = this.props;
    let fontClass = cn("font-weight-bold", "text-sz-md");
    let clickableClass = cn("clickable-icon");
    let upDownColor = "text-tellor-green";
    let upDownIcon = expanded?"fa fa-caret-up":"fa fa-caret-down";
    let upDownClass = cn(fontClass, clickableClass, upDownIcon, upDownColor);

    return (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="3" className={cn("ml-2", align.allCenter, align.noMarginPad)}>
          <i className={cn(upDownClass)}
             onClick={this.props.toggleExpansion} />
        </Col>

      </Row>
    )
  }
}

class CollapseVisibleRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };

    [
      'toggleExpansion'
    ].forEach(fn=>this[fn]=this[fn].bind(this));
  }

  toggleExpansion() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const {
      rows
    } = this.props;

    return (
      <Row className={cn("item-row", "border-bottom", "border-muted", align.topCenter, align.full, "mb-3", align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          {
            rows.map((r, i)=>{
              let fieldData = r.data;
              return (
                <Row key={i} className={cn(align.leftCenter, align.full, align.noMarginPad)}>

                  {
                    i===0&&
                    <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
                      <Controls expanded={this.state.expanded}
                                toggleExpansion={this.toggleExpansion} />
                    </Col>
                  }
                  {
                    i!==0 &&
                    <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
                      &nbsp;
                    </Col>
                  }

                  {
                    fieldData.map((d,j)=>{
                      let comp = d.component;
                      if(!comp) {
                        return null;
                      }
                      return (
                        <Col key={`${i}-${j}`} md={d.width} className={cn(align.leftCenter, "ml-1", align.noMarginPad)}>
                          {comp}
                        </Col>
                      )
                    })
                  }
                </Row>
              )
            })
          }
        </Col>

        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.leftCenter, align.full, align.noMarginPad)}>
            <Col md="1" className={cn(align.leftCenter, align.noMarginPad)}>
               {/*empty for expand icon*/}
            </Col>
            <Col md="11" className={cn( align.leftCenter, align.noMarginPad)}>
              <Body expanded={this.state.expanded}>
                {this.props.children}
              </Body>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const hasFn = (obj, fnName) => {
  if(typeof obj[fnName] !== 'function') {
    throw new Error("Must implement " + fnName);
  }
}

export default class CollapseTable extends React.Component {
  constructor(props) {
    super(props);
    hasFn(this, "buildHeader");
    hasFn(this, "buildBody");
    hasFn(this, "buildFieldRows");
  }

  render() {
    const {
      data,
    } = this.props;
    if(!data || data.length === 0) {
      return (
        <Row className={cn('collapse-table-container', align.allCenter, align.full, align.noMarginPad)}>

          <Col md="12" className={cn(align.allCenter, align.noMarginPad)}>
            <span className={cn("text-center", "font-weight-light")}>
              No Data Yet
            </span>
          </Col>
        </Row>
      )
    }

    return (
      <Row className={cn('collapse-table-container', align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Header>
            {this.buildHeader(data)}
          </Header>
          {
            data.map((d,i)=>(
              <CollapseVisibleRow key={i} rows={this.buildFieldRows(d)}>
                {this.buildBody(d)}
              </CollapseVisibleRow>
            ))
          }
        </Col>
      </Row>
    )
  }
}
