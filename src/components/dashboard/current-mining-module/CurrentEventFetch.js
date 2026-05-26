import React, { useEffect, useContext, useRef, useState } from 'react';
import lodash from 'lodash';

import { GET_LATEST_MINER_VALUES } from 'utils/queries';
import GraphFetch from 'components/shared/GraphFetch';
import { NetworkContext } from '../../../contexts/Network';
import chains from 'utils/chains.js';

const MINERS_PER_EVENT = 5;
const COMPLETED_EVENT_HOLD_MS = 5000;

//TODO: Adjust to just look for miningvalues by current challenge again and again until they have a miningEvent
const CurrentEventFetch = ({ setCurrentEvent }) => {
  const [latestValues, setLatestValues] = useState();
  const [currentDetails, setCurrentDetails] = useState();
  const [findNextDetails, setFindNextDetails] = useState(true);
  const completedEventTimeout = useRef();
  const displayedCompletedChallenge = useRef();

  const [currentNetwork] = useContext(NetworkContext);

  const getLatestCompletedMinerValues = groupedValues =>
    Object.values(groupedValues).find(
      minerValues => minerValues.length >= MINERS_PER_EVENT,
    ) || [];

  const getCurrentChallenge = () =>
    currentDetails._challenge || currentDetails[0];

  const queueNextDetails = () => {
    clearTimeout(completedEventTimeout.current);
    completedEventTimeout.current = setTimeout(() => {
      setFindNextDetails(true);
    }, COMPLETED_EVENT_HOLD_MS);
  };

  const getCompletedEventDetails = minerValues => {
    const challenge = minerValues[0].currentChallenge;
    if (Array.isArray(currentDetails)) {
      return [challenge, ...currentDetails.slice(1)];
    }

    return {
      ...currentDetails,
      0: challenge,
      _challenge: challenge,
    };
  };

  useEffect(() => () => clearTimeout(completedEventTimeout.current), []);

  useEffect(() => {
    const initValues = async () => {
      try {
        const groupedValues = lodash.groupBy(
          latestValues.minerValues,
          'currentChallenge',
        );

        const currentChallenge = getCurrentChallenge();
        const currentMinerValues = groupedValues[currentChallenge] || [];
        const completedMinerValues = getLatestCompletedMinerValues(groupedValues);
        const shouldShowCompletedEvent =
          completedMinerValues.length >= MINERS_PER_EVENT &&
          completedMinerValues[0].currentChallenge !== currentChallenge &&
          displayedCompletedChallenge.current !==
            completedMinerValues[0].currentChallenge;
        const minerValues = shouldShowCompletedEvent
          ? completedMinerValues
          : currentMinerValues;
        if (minerValues.length) {
          const eventDetails = shouldShowCompletedEvent
            ? getCompletedEventDetails(minerValues)
            : currentDetails;
          const event = {
            ...eventDetails,
            _challenge:
              minerValues[0].currentChallenge ||
              currentChallenge,
            minerValues,
            minedValue: 'Pending',
            status: `Mining (${minerValues.length}/${MINERS_PER_EVENT})`,
          };

          setCurrentEvent(event);
          if (minerValues.length >= MINERS_PER_EVENT) {
            displayedCompletedChallenge.current =
              minerValues[0].currentChallenge;
            console.log(
              '5 of 5, showing completed event before looking for new challenge',
            );
            queueNextDetails();
          }
        } else {
          setCurrentEvent({
            ...currentDetails,
            minerValues: groupedValues[currentChallenge],
            noPending: true,
          });
          setFindNextDetails(true);
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
          setFindNextDetails(false);
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
