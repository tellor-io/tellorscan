import React from 'react';
import {
  Navbar,
  NavLink,
  NavItem,
  Nav,
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Logo from './LogoBlock';
import Search from 'Components/Search';

export default class TopMenu extends React.Component {
  render() {
    const {
      withLogo,
      withSearch
    } = this.props;
    let barClass = cn("top-nav", align.full);
    if(withSearch) {
      barClass = cn(barClass, align.topCenter);
    };

    let body = null;
    if(withSearch) {
      body = (
        <React.Fragment>
          <Row className={cn(align.rightCenter, align.full, "pr-4", "m-0", "p-0")}>
            <Col md="6" className={cn(align.rightCenter, "m-0", "p-0")}>
              <Search className="tellor-bg-light"/>
            </Col>
          </Row>

          <Row className={cn(align.allCenter, align.full, "m-0", "p-0")}>
            <Col md="10" className={cn(align.leftCenter, "m-0", "p-0")}>
              {
                    withLogo &&
                    <Logo goHome={this.props.goHome}/>
                  }

              <Nav navbar className={cn("ml-auto", "text-md", "font-weight-light", "p-0")}>
                 <NavItem>
                   <NavLink className={cn("text-dark")} href="#" onClick={this.props.toDisputes} >Dispute Center</NavLink>
                 </NavItem>
              </Nav>
            </Col>
          </Row>
        </React.Fragment>
      )
    } else {
      body = (
        <Row className={cn(align.allCenter, align.full, "m-0", "p-0")}>
          <Col md="10" className={cn(align.leftCenter, "m-0", "p-0")}>
            {
              withLogo &&
              <Logo />
            }
            <Nav navbar className={cn("ml-auto", "text-md", "font-weight-light")}>
               <NavItem>
                <NavLink className={cn("text-dark")} href="#" onClick={this.props.toDisputes} >Dispute Center</NavLink>
               </NavItem>
            </Nav>
          </Col>
        </Row>
      )
    }

    return (
      <Navbar light expand="sm" className={cn(barClass)}>
         {body}
      </Navbar>
    )
  }
}
