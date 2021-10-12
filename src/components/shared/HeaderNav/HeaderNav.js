import React, {useState} from 'react';
import { Link, useLocation,useHistory } from 'react-router-dom';
import './HeaderNav.scss';
import { Web3SignIn } from 'components/shared/Web3SignIn';
import { useMediaQuery } from 'react-responsive';
import { slide as Menu } from 'react-burger-menu';

const HeaderNav = () => {
  // const isMobileHeader = useMediaQuery({query: '(max-width: 680px)'});
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const handleClick = () => {
      setMenuOpen(false);
  }
  const handleStateChange = (hu) => {
      if (hu.isOpen) {
        setMenuOpen(true);
      }
  }



  // ///// DUMMY /////
  const activeVoteItems = 0;

  const allViews = [
    {cat:"home",title:"Home"},
    {cat:"usetellor",title:"Use Tellor"},
    {cat:"howitworks",title:"How it works"},
    {cat:"requestnew",title:"Request a new datapoint"},
    {cat:"live",title:"Live on Tellor"},
    {cat:"trb",title:"TRB, Tellor’s native token"},
    {cat:"becomereporter",title:"Becoming a data reporter"},
    {cat:"getinvolved",title:"Get involved"},
    {cat:"abouttellor",title:"About tellor"}
  ]


  
  return (
    <>
        <Menu
          isOpen={menuOpen}
          onStateChange={(hu) => handleStateChange(hu)}
          >
            {allViews.map(thisView => {
              return (<Link
                        onClick={() => handleClick()}
                        to={thisView.cat === "home"? "/":"/"+thisView.cat}
                        className={location.pathname === "/"+thisView.cat ? "selectedPage" : ''}>
                          {thisView.title}
                      </Link>)
              })
            }
          </Menu>

      <div className="Header">
        <div className="Header__Nav">
          <Link to="/live" className={activeVoteItems>0? "counter hasitems" :  "counter noitems"}>
          {/* <div className={activeVoteItems>0? "counter hasitems" :  "counter noitems"} > */}
            <p>{activeVoteItems}</p>
          {/* </div> */}
          </Link>
          <Web3SignIn/>
        </div>
        <div className="BrandLink">
          <Link to="/">
            <div><span className="logo">tellor</span></div>
            <div><span className="baseline">unstoppable<br />oracle</span></div>
          </Link>
        </div>
      </div>
      
    </>
  );
};

export default HeaderNav;
