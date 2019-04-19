import React from 'react';
import {
  Navbar,
  NavLink,
  NavItem,
  Nav,
  Row,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Logo from './LogoBlock';
import Search from 'Components/Search';
import Loading from 'Components/Loading';

export default class TopMenu extends React.Component {
  render() {
    const {
      balance,
      withSearch,
      title,
      tokenLoading
    } = this.props;

    let barClass = cn("top-nav", align.full);
    if(withSearch) {
      barClass = cn(barClass, align.topCenter);
    };

    //
    let navItems = (
      <React.Fragment>
        <NavItem className={cn(align.allCenter,"mr-2")}>
          <NavLink className={cn("text-dark")} href="#" onClick={this.props.toSettings} >
            <i className={cn("fa fa-gear", "text-dark", "mr-1")} />
            Settings
          </NavLink>
        </NavItem>
        <NavItem className={cn(align.allCenter)}>
          <NavLink className={cn("text-dark")} href="#" onClick={this.props.toDisputes} >
            <i className={cn("fa fa-commenting-o", "text-dark", "mr-1")} />
            Disputes
          </NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            <i className={cn("icon-wallet", "mr-1")} />
            Wallet
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>
              <Loading loading={tokenLoading}/>
              Token Balance: {balance}
            </DropdownItem>
            <DropdownItem onClick={this.props.getTokens}>
              Get Tokens
            </DropdownItem>
            <DropdownItem onClick={this.props.getBalance}>
              Refresh Balance
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </React.Fragment>
    )

    let topBody = null;
    if(withSearch) {
      topBody = (
        <Row className={cn(align.rightCenter, align.full, "pr-4", align.noMarginPad)}>
          <Col md="6" className={cn(align.rightCenter, align.noMarginPad)}>
            <Search className="tellor-bg-light"/>
          </Col>
        </Row>
      )
    }
    let body = (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="10" className={cn(align.leftCenter, align.noMarginPad)}>
          <Row className={cn(align.allCenter, align.noMarginPad, align.full)}>
            <Col md="4" className={cn(align.leftCenter, align.noMarginPad)}>
              <Logo goHome={this.props.goHome}/>
            </Col>
            <Col md="4" className={cn(align.allCenter, align.noMarginPad)}>
                {
                  title &&
                  <h2 className={cn(align.allCenter, "text-muted", "font-weight-bold")}>
                    {title}
                  </h2>
                }
            </Col>
            <Col md="4" className={cn(align.rightCenter, align.noMarginPad)}>
              <Nav navbar className={cn("ml-auto", "text-md", "font-weight-light", "p-0")}>
                {navItems}
              </Nav>
            </Col>
          </Row>
        </Col>
      </Row>
    )


    return (
      <Navbar light expand="sm" className={cn(barClass)}>
         {topBody}
         {body}
      </Navbar>
    )
  }
}
