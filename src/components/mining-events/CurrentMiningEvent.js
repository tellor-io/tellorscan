import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import MiningEventsTable from './MiningEventsTable';
import { ContractContext } from 'contexts/Store';

const CurrentMiningEvent = ({ values }) => {
  // console.log('values', values);

  const [latestValues, setLatestValues] = useState();
  const [contract] = useContext(ContractContext);

  useEffect(() => {
    const initCurrentEvent = async () => {
      try {
        const currentDetails = await contract.getCurrentVariables();

        console.log('currentDetails', currentDetails);

        const groupedValues = _.groupBy(values, 'currentChallenge');

        console.log('groupedValues', groupedValues[currentDetails[0]]);

        //set up and object with request symbol, no value, tip and the values
        // if no values for current we need to get from graph i think

        // const latest = {

        // }
      } catch (e) {
        console.error('error', e);
      }
    };
    if (values && contract) {
      initCurrentEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, contract]);

  return (
    <>
      <div className="TableHeader">
        <h2>Current Mining Event</h2>
      </div>
      {/* <MiningEventsTable pagination={false} events={[event]} /> */}
    </>
  );
};

export default CurrentMiningEvent;
