import React, { useContext, useEffect } from 'react';
import ApolloClient from 'apollo-boost';
import { useQuery } from 'react-apollo';

import { resolvers } from '../../utils/resolvers';
import { getChainData } from 'utils/chains';
import { NetworkContext } from 'contexts/Store';
import Loader from './Loader';

const client = new ApolloClient({
  uri: getChainData(1).subgraph_url,
  clientState: {
    resolvers,
  },
});

const rinkebyClient = new ApolloClient({
  uri: getChainData(4).subgraph_url,
  clientState: {
    resolvers,
  },
});

const GraphFetch = ({ query, setRecords, variables, suppressLoading }) => {
  const [currentNetwork] = useContext(NetworkContext);

  console.log('currentNetwork', currentNetwork);
  // const client = currentNetwork === '1' ? client : rinkebyClient;

  console.log('client', currentNetwork === '1');

  const { loading, error, data } = useQuery(query, {
    client: currentNetwork === '1' ? client : rinkebyClient,
    variables,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  console.log('data', data);
  console.log('error', error);

  if (loading) return <>{!suppressLoading ? <Loader /> : null}</>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetch;
