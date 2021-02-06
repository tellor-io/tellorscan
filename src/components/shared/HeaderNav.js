import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { UserContext } from 'contexts/User';
import { truncateAddr } from 'utils/helpers';
import tellorLogoDark from 'assets/Tellor__Logo--Dark.png';
import ModeSwitcher from './ModeSwitcher';
import NetworkSwitcher from './NetworkSwitcher';
import { Web3SignIn } from 'components/shared/Web3SignIn';


const HeaderNav = () => {
  const { Header } = Layout;
  const [currentUser] = useContext(UserContext);
  const [logo, setLogo] = useState(tellorLogoDark);

  return (
    <Header>
      <div className="Header">
        <div className="BrandLink">
          <Link to="/">
            <img alt="tellor-logo" src={logo} />
            <span>dispute center</span>
          </Link>
        </div>
        <div className="Header__Nav">
          <ModeSwitcher setLogo={setLogo} />
          {/* <Link to="/tellorUpgrade">Tellor V2.6!</Link> */}
          <Link to="/voting">Voting</Link>
          <Link to="/mining">Mining</Link>
          <a
            href="https://prices.tellorscan.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Price Viewer <RightCircleOutlined />
          </a>
          {!currentUser ? null : (
            <span>{truncateAddr(currentUser.address)}</span>
          )}
          <Web3SignIn />

          <NetworkSwitcher />
        </div>
      </div>
    </Header>
  );
};

export default HeaderNav;
