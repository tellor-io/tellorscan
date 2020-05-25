import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import styled from 'styled-components';

import Routes from './Routes';
import HeaderNav from 'components/shared/HeaderNav';

const StyledLayout = styled(Layout)`
  height: 100%;
`;

const App = () => {
  const { Content } = Layout;

  return (
    <Fragment>
      <Helmet defaultTitle="Tellor Dispute Center">
        <meta name="description" content="Tellor Dispute Center" />
      </Helmet>
      <StyledLayout>
        <Router>
          <HeaderNav />
          <Content>
            <Routes />
          </Content>
        </Router>
      </StyledLayout>
    </Fragment>
  );
};

export default App;
