import React, { useContext } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/Store';
import { Web3SignIn } from './Web3SignIn';
import { truncateAddr } from '../../utils/helpers';
import tellorLogoDark from '../../assets/Tellor__Logo--Dark.png';

const StyledHeader = styled.div`
  display: flex;
  width: 100%;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const StyledBrandLink = styled.div`
  a {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    img {
      height: 60px;
      width: auto;
      display: inline-block;
    }
    span {
      color: #5cfcb6;
      font-size: 21px;
      font-weight: 300;
      margin-bottom: -11px;
    }
  }
`;

const StyledHeaderNav = styled.div`
  display: inline-block;
  margin-left: auto;
  > * {
    margin-left: 25px;
    font-size: 1.5em;
    color: #5cfcb6;
    &:last-child {
      border: 2px solid #5cfcb6;
      color: #5cfcb6;
      border-radius: 50px;
      padding: 10px 15px;
    }
  }
`;

const HeaderNav = () => {
  const { Header } = Layout;
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <Header>
      <StyledHeader>
        <StyledBrandLink>
          <Link to="/">
            <img alt="tellor-logo" src={tellorLogoDark} />
            <span>dispute center</span>
          </Link>
        </StyledBrandLink>
        <StyledHeaderNav>
          <Link to="/disputes">Disputes</Link>
          <Link to="/mining">Mining</Link>
          {!currentUser ? (
            <Web3SignIn setCurrentUser={setCurrentUser} />
          ) : (
            <span>{truncateAddr(currentUser.username)}</span>
          )}
        </StyledHeaderNav>
      </StyledHeader>
    </Header>
  );
};

export default HeaderNav;
