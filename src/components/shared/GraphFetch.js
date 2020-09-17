import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import Loader from './Loader';

const GraphFetch = ({ query, setRecords, variables, suppressLoading }) => {
  const { loading, error, data } = useQuery(query, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  });

  console.log('data', data);

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading) return <>{!suppressLoading ? <Loader /> : null}</>;
  if (error) return <></>;

  return <></>;
};

export default GraphFetch;
