import React from 'react';
import { Link } from 'react-router-dom';

import MiningEventsTable from './MiningEventsTable';

const RecentMiningEvents = ({ events }) => {
  return (
    <div>
      <div className="TableHeader">
        <h2>Recent Mining Events</h2>
        <Link to="/mining">View All</Link>
      </div>
      <MiningEventsTable pagination={false} events={events} />
    </div>
  );
};

export default RecentMiningEvents;
