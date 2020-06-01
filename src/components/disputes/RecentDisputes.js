import React from 'react';
import { Link } from 'react-router-dom';

import DisputesTable from './DisputesTable';

const RecentDisputes = ({ disputes }) => {
  return (
    <div>
      <div className="TableHeader">
        <h2>Recent Disputes</h2>
        <Link to="/disputes">View All</Link>
      </div>
      <DisputesTable pagination={false} disputes={disputes} />
    </div>
  );
};

export default RecentDisputes;
