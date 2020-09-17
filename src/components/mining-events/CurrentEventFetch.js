import React, { useEffect, useContext, useState } from 'react';
import _ from 'lodash';

import { GET_LATEST_MINER_VALUES } from 'utils/queries';
import { ContractContext } from 'contexts/Store';
import GraphFetch from 'components/shared/GraphFetch';

//TODO: Adjust to just look for miningvalues by current challenge again and again until they have a miningEvent

const CurrentEventFetch = ({ setCurrentEvent }) => {
  const [latestValues, setLatestValues] = useState();
  const [currentDetails, setCurrentDetails] = useState();
  const [findNextDetails, setFindNextDetails] = useState();

  const [contract] = useContext(ContractContext);

  useEffect(() => {
    if (contract) {
      getCurrentDetails();
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

        //should we check on [0] _currentChallenge?
        // if (+currentDetails[1]) {
        if (+currentDetails[0]) {
          const minerValues = groupedValues[currentDetails[0]] || [];

          const event = {
            ...currentDetails,
            // ...latestValues.request,
            minerValues,
            minedValue: 'Pending',
            status: `Mining (${minerValues.length}/5)`,
          };
          // if (!latestValues.request) {
          //   event.id = '0';
          // }
          setCurrentEvent(event);

          if (minerValues.length === 5) {
            console.log('5 of 5, looking for new challenge');
            setFindNextDetails(true);
          }
        } else {
          console.log('No pending challenge');
          setCurrentEvent({
            ...currentDetails,
            // ...latestValues.request,
            minerValues: groupedValues[currentDetails[0]],
            noPending: true,
          });
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    console.log('latestValues', latestValues);
    console.log('currentDetails', currentDetails);

    if (latestValues && currentDetails) {
      initValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestValues]);

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
      const currentDetails = await contract.service.getCurrentVariables();
      setCurrentDetails(currentDetails);

      if (+currentDetails[1]) {
        setFindNextDetails(false);
      } else {
        setFindNextDetails(true);
      }
    } catch (e) {
      console.error('error', e);
    }
  };

  if (currentDetails) {
    return (
      <>
        <GraphFetch
          query={GET_LATEST_MINER_VALUES}
          // variables={{ requestId: currentDetails[1] }}
          setRecords={setLatestValues}
          entity={'minerValues'}
        />
      </>
    );
  }
  return <></>;
};

export default CurrentEventFetch;
