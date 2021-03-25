import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from 'contexts/User';
import NetworkSwitcher from './NetworkSwitcher';
import { Web3SignIn } from 'components/shared/Web3SignIn';
import {ReactComponent as TellorLogo} from 'assets/tellorscan.svg';
import { useMediaQuery } from 'react-responsive';


const HeaderNav = () => {
  const isMobile = useMediaQuery({query: '(max-width: 680px)'});
  console.log("isMobile >>",isMobile);

  const [currentUser] = useContext(UserContext);
  return (
    <>
    {isMobile?
         <div className="Header">
         <div className="BrandLink">
           <Link to="/">
             <TellorLogo />
           </Link>
           <NetworkSwitcher />
         </div>
         <div className="Header__Nav">
           <Web3SignIn />
         </div>
       </div>
    :
      <div className="Header">
        <div className="BrandLink">
          <Link to="/">
            <TellorLogo />
          </Link>
        </div>
        <div className="Header__Nav">
          <NetworkSwitcher />
          <Web3SignIn />
        </div>
      </div>
    }
      </>
  );
};

export default HeaderNav;
