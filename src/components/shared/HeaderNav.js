import React from 'react';
import { Link } from 'react-router-dom';

import NetworkSwitcher from './NetworkSwitcher';
import { Web3SignIn } from 'components/shared/Web3SignIn';
import {ReactComponent as TellorLogo} from 'assets/tellorscan.svg';
import { useMediaQuery } from 'react-responsive';

const HeaderNav = ({activeDisputesCount}) => {
  const isMobileHeader = useMediaQuery({query: '(max-width: 680px)'});
  return (
    <>
    {isMobileHeader?
         <div className="Header">
         <div className="BrandLink">
           <Link to="/">
             <TellorLogo />
           </Link>
           <NetworkSwitcher />
         </div>
         <div className="Header__Nav">
           <Web3SignIn activeDisputesCount={activeDisputesCount} />
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
          <Web3SignIn activeDisputesCount={activeDisputesCount} />
        </div>
      </div>
    }
      </>
  );
};

export default HeaderNav;
