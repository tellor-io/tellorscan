import React, { useContext, useEffect } from 'react';
import { ApolloClient, useQuery } from '@apollo/client'


import { cache } from '../../utils/cache';
import { getChainData } from 'utils/chains';
import { NetworkContext } from 'contexts/Store';
import Loader from './Loader';

const client = new ApolloClient({
  uri: getChainData(1).subgraph_url,
  cache: cache
});

const rinkebyClient = new ApolloClient({
  uri: getChainData(4).subgraph_url,
  cache: cache
});

const GraphFetch = ({ query, setRecords, variables, suppressLoading }) => {
  const [currentNetwork] = useContext(NetworkContext);

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

  if (loading) return <>{!suppressLoading ? <Loader /> : null}</>;
  if (error) console.log('error', error);

  return <></>;
};

export default GraphFetch;
