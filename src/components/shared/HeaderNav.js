import React, { useContext } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/Store';
import { Web3SignIn } from './Web3SignIn';
import { truncateAddr } from '../../utils/helpers';

const StyledHeaderTellor = styled.span`
  color: white;
  font-size: 36px;
`;
const StyledHeaderData = styled.span`
  color: #53f1b6;
  font-size: 36px;
`;

const HeaderNav = () => {
  const { Header } = Layout;
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <Header>
      <Link to="/">
        <StyledHeaderTellor>tellor</StyledHeaderTellor>
        <StyledHeaderData>dispute center</StyledHeaderData>
      </Link>
      <Link to="/disputes">Disputes</Link>
      <Link to="/mining">Mining</Link>

      {!currentUser ? (
        <Web3SignIn setCurrentUser={setCurrentUser} />
      ) : (
        <span>{truncateAddr(currentUser.username)}</span>
      )}
    </Header>
  );
};

export default HeaderNav;
