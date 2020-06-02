import React, { useState } from 'react';

import { GET_ALL_DISPUTES } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import AllDisputes from 'components/disputes/AllDIsputes';
import OpenDisputes from 'components/disputes/OpenDisputes';
import OpenDisputesFetch from 'components/disputes/OpenDiputesFetch';

const Disputes = () => {
  const [disputes, setDisputes] = useState();

  return (
    <>
      <OpenDisputesFetch />
      <GraphFetch query={GET_ALL_DISPUTES} setRecords={setDisputes} />
      {disputes ? (
        <>
          <div className="Hero">
            <div className="View">
              <OpenDisputes />
            </div>
          </div>
          <div className="View">
            <AllDisputes disputes={disputes.disputes} />
          </div>
        </>
      ) : null}
    </>
  );
};

export default Disputes;
