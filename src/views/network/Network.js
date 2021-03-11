import React, { useState } from 'react';

import { GET_NETWORK_DIFFICULTY } from 'utils/queries';
import NetworkDifficulty from 'components/charts/NetworkDifficulty';
import GraphFetch from 'components/shared/GraphFetch';


const Network = () => {
  const [data, setData] = useState();

  return (
    <>
      <GraphFetch
        query={GET_NETWORK_DIFFICULTY}
        setRecords={setData}
      />
      {data ? (
        <div className="View">
          <NetworkDifficulty data={data.networkStates} />
        </div>
      ) : null}
    </>
  );
};

export default Network;
