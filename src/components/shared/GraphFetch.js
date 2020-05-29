import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import Loader from './Loader';

const GraphFetch = ({
  query,
  setRecords,
  variables,
  suppressLoading,
  entity,
}) => {
  const { loading, error, data } = useQuery(query, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: 1000,
  });

  useEffect(() => {
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading) return <>{!suppressLoading ? <Loader /> : null}</>;
  if (error) return <p className="View">Sorry there's been an error</p>;

  return <></>;
};

export default GraphFetch;
