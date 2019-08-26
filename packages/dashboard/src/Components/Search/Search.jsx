import React from 'react';
import {
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {toastr} from 'react-redux-toastr';
import MainLoader from 'Components/MainLoader';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    [
      'keyDown',
      'updateText',
      'doSearch'
    ].forEach(fn=>this[fn] = this[fn].bind(this));
  }

  keyDown(e) {
    if(e.key === 'Enter') {
      let id = this.state.text - 0;
      this.setState({
        text: ''
      }, ()=>this.props.runSearch(id))
    }
  }

  doSearch() {
    let id = this.state.text - 0;
    if(!id) {
      toastr.error("Error", "Invalid api request ID");
    } else {
      this.setState({
        text: ''
      }, ()=>this.props.runSearch(id));
    }
  }

  updateText(e) {
    this.setState({
      text: e.target.value
    })
  }

  render() {
    const {
      className,
      loading
    } = this.props;

    return (
      <Row className={cn( "search-box",className, align.allCenter, align.full, )}>
        <MainLoader loading={loading}/>
        <Col md="12" className={cn(align.leftCenter, "p-0", "m-0", "font-weight-light", "text-muted", "text-sz-md")}>
          <div className={cn("rounded",align.full, align.leftCenter)}>
            <i className={cn(align.allCenter, "search-icon fa fa-search", "p-3", "m-0", "bg-tellor-green")} onClick={this.doSearch} />
            <div className={cn("input-wrapper", align.full, align.leftCenter, align.noMarginPad)}>
              <input type="number" placeholder="request-ID" className={cn(align.full, "ml-1", "m-0")}
                onChange={this.updateText}
                onKeyPress={this.keyDown}
              />
            </div>
          </div>
        </Col>

      </Row>
    )
  }
}
