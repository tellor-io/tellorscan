import React, { useEffect, useContext, useState } from 'react';
import lodash from 'lodash';

import { GET_LATEST_MINER_VALUES } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import { NetworkContext } from '../../contexts/Network';
import chains from 'utils/chains.js';

//TODO: Adjust to just look for miningvalues by current challenge again and again until they have a miningEvent
const CurrentEventFetch = ({ setCurrentEvent }) => {
  const [latestValues, setLatestValues] = useState();
  const [currentDetails, setCurrentDetails] = useState();
  const [findNextDetails, setFindNextDetails] = useState(true);

  const [currentNetwork] = useContext(NetworkContext);

  useEffect(() => {
    const initValues = async () => {
      try {
        const groupedValues = lodash.groupBy(
          latestValues.minerValues,
          'currentChallenge',
        );

        const minerValues = groupedValues[currentDetails[0]] || [];

        if (minerValues.length) {
          const event = {
            ...currentDetails,
            minerValues,
            minedValue: 'Pending',
            status: `Mining (${minerValues.length}/5)`,
          };
          setCurrentEvent(event);

          if (minerValues.length === 5) {
            console.log('5 of 5, looking for new challenge');
            setFindNextDetails(true);
          }
        } else {
          setCurrentEvent({
            ...currentDetails,
            minerValues: groupedValues[currentDetails[0]],
            noPending: true,
          });
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    if (latestValues && currentDetails) {
      initValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestValues, currentDetails]);

  useEffect(() => {
    if (findNextDetails) {
      const interval = setInterval(() => {
        getCurrentDetails();
      }, 2000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findNextDetails]);

  const getCurrentDetails = async () => {
    try {
      fetch(chains[currentNetwork].apiURL + "/currentVariables")
        .then(response => response.json())
        .then(data => {
          setCurrentDetails(data.variables)
          setFindNextDetails(true);
        }
        );
    } catch (e) {
      console.error('error', e);
    }
  };

  if (currentDetails) {
    return (
      <>
        <GraphFetch
          query={GET_LATEST_MINER_VALUES}
          setRecords={setLatestValues}
          entity={'minerValues'}
          suppressLoading="true"
        />
      </>
    );
  }
  return <></>;
};

export default CurrentEventFetch;
