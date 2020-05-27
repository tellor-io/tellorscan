import React, { useEffect, useContext, useState } from 'react';
import _ from 'lodash';

import { GET_LATEST_MINER_VALUES, GET_REQUEST } from 'utils/queries';
import { ContractContext } from 'contexts/Store';
import GraphFetch from 'components/shared/GraphFetch';

const CurrentEventFetch = ({ setCurrentEvent }) => {
  const [latestValues, setLatestValues] = useState();
  const [currentDetails, setCurrentDetails] = useState();
  const [noChallenge, setNoChallenge] = useState();
  const [contract] = useContext(ContractContext);

  useEffect(() => {
    const initCurrentEvent = async () => {
      try {
        const currentDetails = await contract.getCurrentVariables();
        setCurrentDetails(currentDetails);
      } catch (e) {
        console.error('error', e);
      }
    };
    if (contract) {
      initCurrentEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  useEffect(() => {
    const initValues = async () => {
      try {
        const groupedValues = _.groupBy(
          latestValues.minerValues,
          'currentChallenge',
        );

        if (latestValues.request) {
          const minerValues = groupedValues[currentDetails[0]] || [];
          setCurrentEvent({
            ...currentDetails,
            ...latestValues.request,
            minerValues,
            minedValue: 'Pending',
            status: `Mining (${minerValues.length}/5)`,
          });
        } else {
          setCurrentEvent({
            ...currentDetails,
            ...latestValues.request,
            minerValues: groupedValues[currentDetails[0]],
            noPending: true,
          });
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    console.log('latestValues', latestValues);
    if (latestValues && currentDetails) {
      initValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestValues]);

  if (currentDetails) {
    return (
      <>
        <GraphFetch
          query={GET_LATEST_MINER_VALUES}
          variables={{ requestId: currentDetails[1] }}
          setRecords={setLatestValues}
          entity={'minerValues'}
        />
      </>
    );
  }

  return <></>;
};

export default CurrentEventFetch;
