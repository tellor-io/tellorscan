import React from 'react';
import { useQuery } from 'react-apollo';

import { GET_LATEST_EVENTS } from 'utils/queries';

const EventsFetch = () => {
  // const { loading, error, data, fetchMore } = useQuery(GET_LATEST_EVENTS, {
  const { loading, error, data, fetchMore } = useQuery(GET_LATEST_EVENTS, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <p className="View">Loading</p>;
  if (error) return <p className="View">Sorry there's been an error</p>;

  console.log('data', data);

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

  return (
    <>
      <div>yolo</div>
    </>
  );
};

export default EventsFetch;
