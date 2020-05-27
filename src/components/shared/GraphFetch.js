import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import Loader from './Loader';

const GraphFetch = ({ query, setRecords, suppressLoading }) => {
  // const { loading, error, data, fetchMore } = useQuery(query, {
  const { loading, error, data } = useQuery(query, {
    fetchPolicy: 'network-only',
    // pollInterval: 500,
  });

  useEffect(() => {
    console.log('data', data);
    if (data) {
      setRecords(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading) return <>{!suppressLoading ? <Loader /> : null}</>;
  if (error) return <p className="View">Sorry there's been an error</p>;

  // fetchMore({
  //   variables: { skip: data.moloches.length },
  //   updateQuery: (prev, { fetchMoreResult }) => {
  //     if (fetchMoreResult.moloches.length === 0) {
  //       return prev;
  //     }

  //     return Object.assign({}, prev, {
  //       moloches: [...prev.moloches, ...fetchMoreResult.moloches],
  //     });
  //   },
  // });

  return <></>;
};

export default GraphFetch;
