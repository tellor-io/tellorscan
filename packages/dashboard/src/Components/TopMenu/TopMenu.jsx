import React from 'react';
import {
  Navbar,
  Nav,
  NavLink,
  NavItem
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Logo from './LogoBlock';

export default class TopMenu extends React.Component {
  render() {
    const {
      withLogo
    } = this.props;

    return (
      <Navbar light expand="sm" className={cn(align.full, align.leftCenter, "top-nav")}>
         {
           withLogo &&
           <Logo />
         }
         <Nav navbar className={cn("ml-auto", "text-md", "font-weight-light")}>
            <NavItem>
              <NavLink className={cn("text-dark")} href="/" >Dispute Center</NavLink>
            </NavItem>
          </Nav>
      </Navbar>
    )
  }
}
