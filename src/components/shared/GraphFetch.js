import React, { useContext, useEffect } from 'react';
import { ApolloClient, useQuery } from '@apollo/client'


import { cache } from 'utils/cache';
import { chains } from 'utils/chains';
import { NetworkContext } from 'contexts/Network';

let clientM = new ApolloClient({
  uri: chains[1].subgraphURL,
  cache: cache
})
let clientR = new ApolloClient({
  uri: chains[4].subgraphURL,
  cache: cache
})

const GraphFetch = ({ query, setRecords, variables, suppressLoading }) => {
  const [currentNetwork] = useContext(NetworkContext);
  const { loading, error, data } = useQuery(query, {
    client: +currentNetwork === 1 ? clientM : clientR,
    variables,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
  }, [data]);

  if (loading) return <>{!suppressLoading ? <p>Load</p> : null}</>;
  if (error) console.log('error', error);

  return <></>;
};

export default GraphFetch;
