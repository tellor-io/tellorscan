import React from 'react';
import {
  NavbarBrand
} from 'reactstrap';
//import logo from 'Assets/images/logo.png';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class LogoBlock extends React.Component {
  render() {
    const { logo_only } = this.props;

    let brand = null;
    if(!logo_only) {
      brand = (
        <div className={cn(align.justLeft, align.alignCenter, "flex-column")}>
          <div className={cn( align.leftLeft, "w-100", "mb-0", "pb-0")}>
            <span className={cn(align.rightCenter, "m-0", "p-0", "font-weight-bold", "text-black")} style={{fontSize: "48px"}}>tellor</span>
            <span className={cn("font-weight-bold", "text-tellor-green")} style={{fontSize: "48px"}}>scan</span>
          </div>
        </div>
      )
    }

    return (
      <NavbarBrand href="#" onClick={this.props.goHome} className="d-inline-flex flex-row tellor-brand align-items-center">
        {brand}
      </NavbarBrand>
    )
  }
}
