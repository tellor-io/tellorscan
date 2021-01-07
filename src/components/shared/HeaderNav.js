import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/Store';
import { Web3SignIn } from './Web3SignIn';
import { truncateAddr } from '../../utils/helpers';
import tellorLogoDark from '../../assets/Tellor__Logo--Dark.png';
import ModeSwitcher from './ModeSwitcher';
import NetworkSwitcher from './NetworkSwitcher';

const HeaderNav = () => {
  const { Header } = Layout;
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
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
          <Link to="/tellorUpgrade">Tellor V2.6!</Link>
          <Link to="/disputes">Disputes</Link>
          <Link to="/mining">Mining</Link>
          <a
            href="https://prices.tellorscan.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Price Viewer <RightCircleOutlined />
          </a>

          {!currentUser ? (
            <Web3SignIn setCurrentUser={setCurrentUser} />
          ) : (
            <span>{truncateAddr(currentUser.username)}</span>
          )}
          <NetworkSwitcher />
        </div>
      </div>
    </Header>
  );
};

export default HeaderNav;
