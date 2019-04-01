import React from 'react';
import {
  NavbarBrand
} from 'reactstrap';
import logo from 'Assets/images/logo.png';
import cn from 'classnames';
import * as align from 'Constants/alignments';

export default class LogoBlock extends React.Component {
  render() {
    const { logo_only } = this.props;

    let brand = null;
    if(!logo_only) {
      brand = (
        <div className={cn(align.justLeft, align.alignCenter, "d-none", "d-md-flex", "flex-column")}>
          <div className={cn( align.leftLeft, "w-100", "ml-2", "mb-0", "pb-0")}>
            <span className={cn(align.rightCenter, "m-0", "p-0", "tellor-text-highlight")}>Tellor</span>
            <span className="tellor-text-normal">scan</span>
          </div>
        </div>
      )
    }

    return (
      <NavbarBrand href="/dashboard/main" className="d-inline-flex flex-row tellor-brand align-items-center">
        <img src={logo} alt="logo"/>
        {brand}
      </NavbarBrand>
    )
  }
}
