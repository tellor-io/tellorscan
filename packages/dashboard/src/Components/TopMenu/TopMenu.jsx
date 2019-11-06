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
import Toggle from 'react-toggle';

/*
<Col md="3" className={cn(align.allCenter, align.noMarginPad)}>
    {
      title &&
      <h2 className={cn(align.allCenter, "text-muted", "font-weight-bold")}>
        {title}
      </h2>
    }
</Col>
*/

export default class TopMenu extends React.Component {
  render() {
    const {
      balance,
      withSearch,
      title,
      tokenLoading,
      realtimeRunning
    } = this.props;

    let barClass = cn("top-nav", align.full);
    if(withSearch) {
      barClass = cn(barClass, align.topCenter);
    };

    //{realtimeRunning?"Stop Realtime Updates":"Start Realtime Updates"}
    let navItems = (
      <React.Fragment>
        <div className={cn(align.topCenter, "pr-3", align.noMarginPad)}>
          <div className={cn(align.full, "text-right", "text-sz-sm", "font-weight-light", "text-muted")}>
            auto-refresh
          </div>
          <div className={cn(align.rightCenter, align.full, align.noMarginPad)}>
              {
                realtimeRunning &&
                <i className={cn("fa fa-spinner fa-spin text-sz-md mr-1 text-dark")} />
              }
              <Toggle icons={false} checked={realtimeRunning} onChange={()=>{this.props.toggleRealtime()}} />
          </div>
        </div>
        <NavItem className={cn(align.allCenter,"mr-2")}>
          <NavLink className={cn("text-dark")} href="#" onClick={this.props.toSettings} >
            Settings
          </NavLink>
        </NavItem>
        <NavItem className={cn(align.allCenter)}>
          <NavLink className={cn("text-dark")} href="#" onClick={this.props.toDisputes} >
            Disputes
          </NavLink>
        </NavItem>
        <NavItem className={cn(align.allCenter)}>
          <NavLink className={cn("text-dark")} href="#" onClick={this.props.toMining} >
            Mining
          </NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
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
    /**
     *  <Col xs="4" className={cn(align.rightCenter, align.noMarginPad)}>
                  <div className={cn(align.topCenter,  align.noMarginPad)}>
                    <div className={cn(align.full, "text-right", "text-sz-sm", "font-weight-light", "text-muted")}>
                      auto-refresh
                    </div>
                    <div className={cn(align.rightCenter, align.full, "border", "border-warning", align.noMarginPad)}>
                        {
                          realtimeRunning &&
                          <i className={cn("fa fa-spinner fa-spin text-sz-md mr-1 text-dark")} />
                        }
                        <Toggle icons={false} checked={realtimeRunning} onChange={()=>{this.props.toggleRealtime()}} />
                    </div>
                  </div>
              </Col>
     */
    let body = (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="10" className={cn(align.leftCenter, align.noMarginPad)}>
          <div className={cn(align.full, align.noMarginPad)}>
            <Row className={cn(align.allCenter, align.noMarginPad, align.full)}>
              <Col md="4" className={cn(align.leftCenter, align.noMarginPad)}>
                <Logo goHome={this.props.goHome}/>
              </Col>
             
              
              <Col md="8" className={cn(align.rightCenter, align.noMarginPad)}>
                
                  <Nav navbar className={cn("ml-auto","text-md", "font-weight-light", "p-0")}>
                    {navItems}
                  </Nav>
              </Col>
            </Row>
          </div>
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
