import React,{Fragment} from 'react';
import classnames from 'classnames';

export default class Loading extends React.Component {
  render() {
    let {
      loading,
      status,
      size,
      small
    } = this.props;

    if(!loading) {
      return null;
    }
    if(small) {
      size = "small";
    }

    return (
      <div className={classnames("loading-overlay", size)}>
        <i className={classnames("spinner","fa", "fa-spin", "fa-circle-o-notch",size)}/>
      </div>
    )
  }
}
