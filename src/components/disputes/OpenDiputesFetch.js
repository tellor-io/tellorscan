import React, { useEffect, useContext, useState } from 'react';

import { GET_LATEST_DISPUTES } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import { OpenDisputesContext } from 'contexts/Store';

const OpenDisputesFetch = () => {
  const [latestValues, setLatestValues] = useState();
  const [, setOpenDisputes] = useContext(OpenDisputesContext);

  useEffect(() => {
    if (latestValues) {
      const openDisputes = latestValues.disputes.filter(
        (dispute) => dispute.status === 'Open Dispute',
      );

      setOpenDisputes(openDisputes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestValues]);

  return (
    <>
      <GraphFetch
        query={GET_LATEST_DISPUTES}
        setRecords={setLatestValues}
        suppressLoading={true}
      />
    </>
  );
};

export default OpenDisputesFetch;
