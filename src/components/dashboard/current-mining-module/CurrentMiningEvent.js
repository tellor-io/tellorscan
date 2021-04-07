import React from 'react';
import CurrentMiningVisual from './CurrentMiningVisual';

const CurrentMiningEvent = ({ currentEvent }) => {
  return (
      <>
        <CurrentMiningVisual currentEvent={currentEvent} />
      </>
  );
};

export default CurrentMiningEvent;
