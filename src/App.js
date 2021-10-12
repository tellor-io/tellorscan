import React, { Fragment, useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Routes from './Routes';
import HeaderNav from 'components/shared/HeaderNav/HeaderNav';
import Footer from 'components/shared/Footer/Footer';
import GraphFetch from 'components/shared/GraphFetch';
import { NetworkContext } from 'contexts/Network';
import { chains } from 'utils/chains';
import { GET_ALL_EVENTS } from 'utils/queries';
import { GET_VOTING } from 'utils/queries';

import { UserContext } from 'contexts/User';


const App = () => {
  const [events, setEvents] = useState();
  const [votes, setVotes] = useState();
    // const [currentNetwork] = useContext(NetworkContext);
  // const [prices, setPrices] = useState(false);
  // const [disputes, setDisputes] = useState();
  // const [disputesReady, setDisputesReady] = useState(false);
  // const [topCounter, setTopCounter] = useState(0);

  // const [currentUser] = useContext(UserContext);

  // useEffect(() => {
  //   getPrices(setPrices, currentNetwork)
  // }, [currentNetwork])

  // const getPrices = async (setPrices, currentNetwork) => {
  //   try {
  //     fetch(chains[currentNetwork].apiURL + "/prices")
  //       .then(response => response.json())
  //       .then(data => {
  //         setPrices(data)
  //       }
  //       );
  //   } catch (e) {
  //     console.error('error', e);
  //   }
  // };


  // useEffect(() => {
  //   if(votes && votes.disputes){
  //     let count = 0;
  //     votes.disputes.forEach((v,i) => {
  //         if(v.inVoteWindow){
  //           count = count +1;
  //         }
  //       });
  //       setDisputes(votes.disputes);
  //       setActiveDisputesCount(count);
  //       setDisputesReady(true);
  //   } else {
  //     setActiveDisputesCount(0);
  //     setDisputesReady(true);
  //   }
  // },[votes, currentUser])



  return (
    <>
    <Fragment>
      <Helmet defaultTitle="Tellor Scan">
        <meta name="description" content="Tellor Scan" />
      </Helmet>
        <Router>
          <HeaderNav />
            <Routes />
            <Footer />
        </Router>
    </Fragment>
    <GraphFetch
      query={GET_ALL_EVENTS}
      setRecords={setEvents}
    />
    <GraphFetch
      query={GET_VOTING}
      setRecords={setVotes}
      suppressLoading={true}
    />
    </>
  );
};

export default App;
