import React, { Component } from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {
  LABEL_CLASS,
  VALUE_CLASS
} from 'Views/dashboard/overview/common';

export default class TellorPrice extends React.Component {
    state ={
      price : 1
    }

    componentWillMount(){
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd')
        .then(res => res.json())
        .then((data) => {
         console.log("this is the data", data['tellor']['usd']);
           let d = data['tellor']['usd'].toFixed(2)
           console.log(d)
          this.setState({price:d})
        }).catch("error in api call")
    }

    render(){
    return (
      <Row className={cn("tellor-price", align.topCenter, align.full, "m-0")}>

        <Col md="12" className={cn(align.leftCenter, align.full)}>
          <Row className={cn(align.leftCenter, align.full)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              <i className={cn("icon-tag", "text-muted", "font-weight-light")}/>
            </Col>
            <Col md="10" className={cn(LABEL_CLASS)}>
              Tellor Price
            </Col>
          </Row>
        </Col>
        <Col md="12" className={cn(align.leftCenter, align.full)}>
          <Row className={cn(align.leftCenter, align.full)}>
            <Col md="1" className={cn(align.leftCenter, "mr-2")}>
              &nbsp;
            </Col>
            <Col md="10" className={cn(VALUE_CLASS)}>
              {this.state.price}
            </Col>
          </Row>
        </Col>

      </Row>
    )
  }
}
