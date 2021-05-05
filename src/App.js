import React, { Fragment, useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';

import Routes from './Routes';
import HeaderNav from 'components/shared/HeaderNav';
import Footer from 'components/shared/Footer';

import { GET_ALL_EVENTS } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import { NetworkContext } from 'contexts/Network';
import { chains } from 'utils/chains';

const App = () => {
  const [events, setEvents] = useState();
  const { Content } = Layout;
  const [currentNetwork] = useContext(NetworkContext);
  const [prices, setPrices] = useState(false);

  useEffect(() => {
    getPrices(setPrices, currentNetwork)
  }, [currentNetwork])

  const getPrices = async (setPrices, currentNetwork) => {
    try {
      fetch(chains[currentNetwork].apiURL + "/prices")
        .then(response => response.json())
        .then(data => {
          setPrices(data)
        }
        );
    } catch (e) {
      console.error('error', e);
    }
  };
  
  console.log("events in App.js:",events);
  console.log("prices in App.js:",prices);

  
  return (
    <>
    <GraphFetch
      query={GET_ALL_EVENTS}
      setRecords={setEvents}
    />
    <Fragment>
      <Helmet defaultTitle="Tellor Scan">
        <meta name="description" content="Tellor Scan" />
      </Helmet>
        <Router>
          <HeaderNav />
          <Content>
            <Routes events={events} prices={prices} />
          </Content>
          <Footer />
        </Router>
    </Fragment>
    </>
  );
};

export default App;
