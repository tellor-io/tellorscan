import React, { useEffect, useContext, useState } from 'react';
import _ from 'lodash';

import { GET_LATEST_MINER_VALUES } from 'utils/queries';
import { ContractContext } from 'contexts/Store';
import GraphFetch from 'components/shared/GraphFetch';

const CurrentEventFetchTwo = ({ setCurrentEvent }) => {
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

        if (latestValues.request) {
          const minerValues = groupedValues[currentDetails[0]] || [];
          setCurrentEvent({
            ...currentDetails,
            ...latestValues.request,
            minerValues,
            minedValue: 'Pending',
            status: `Mining (${minerValues.length}/5)`,
          });

          if (minerValues.length === 5) {
            console.log('5 of 5, looking for new challenge');
            setFindNextDetails(true);
          }
        } else {
          setCurrentEvent({
            ...currentDetails,
            ...latestValues.request,
            minerValues: groupedValues[currentDetails[0]],
            noPending: true,
          });

          // console.log('no current variables, refetching');
          // setFindNextDetails(true);
          // TODO: if graph doesn't have the current we need to build it and display until it shows

          setTimeout(() => {
            getCurrentDetails();
          }, 2000);
        }
      } catch (e) {
        console.error('error', e);
      }
    };

    if (latestValues && currentDetails) {
      initValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestValues]);

  useEffect(() => {
    if (findNextDetails) {
      const interval = setInterval(() => {
        console.log('refetch');
        getCurrentDetails();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [findNextDetails]);

  const getCurrentDetails = async () => {
    try {
      const currentDetails = await contract.service.getCurrentVariables();

      console.log('currentDetails', currentDetails);

      if (currentDetails[1]) {
        setCurrentDetails(currentDetails);
        setFindNextDetails(false);
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
          variables={{ requestId: currentDetails[1] }}
          setRecords={setLatestValues}
          entity={'minerValues'}
        />
      </>
    );
  }

  return <></>;
};

export default CurrentEventFetchTwo;
