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
        <div className={cn( align.justLeft, align.alignCenter, "flex-column", align.noMarginPad)}>
          <div className={cn( align.leftLeft, align.full, align.noMarginPad)}>
            <span className={cn(align.rightCenter, align.noMarginPad, "font-weight-bold", "text-black")} style={{fontSize: "48px"}}>tellor</span>
            <span className={cn("font-weight-bold", "text-tellor-green", align.noMarginPad)} style={{fontSize: "48px"}}>scan</span>
          </div>
        </div>
      )
    }

    return (
      <NavbarBrand href="#" onClick={this.props.goHome} className={cn(align.leftCenter, align.full, align.noMarginPad)}>
        {brand}
      </NavbarBrand>
    )
  }
}
