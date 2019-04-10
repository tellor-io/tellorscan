import React from 'react';
import classnames from 'classnames';

export default class Loading extends React.Component {
  render() {
    let {
      loading,
      size,
      small
    } = this.props;

    if(!loading) {
      return null;
    }
    if(small) {
      size = "small";
    }

    let spinClass = "fa-spinner"; //"fa-circle-o-notch"
    return (
      <div className={classnames("loading-overlay", size)}>
        <i className={classnames("spinner","fa", "fa-spin", spinClass,size)}/>
      </div>
    )
  }
}
