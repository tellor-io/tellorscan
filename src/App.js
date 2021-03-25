import React, { Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import styled from 'styled-components';

import Routes from './Routes';
import HeaderNav from 'components/shared/HeaderNav';
import Footer from 'components/shared/Footer';

const App = () => {
  const { Content } = Layout;
  return (
    <Fragment>
      <Helmet defaultTitle="Tellor Scan">
        <meta name="description" content="Tellor Scan" />
      </Helmet>

        <Router>
          <HeaderNav />

          <Content>
            <Routes />
          </Content>

          
          <Footer />
        
        </Router>

    </Fragment>
  );
};

export default App;
