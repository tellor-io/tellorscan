import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import DisputesTable from './DisputesTable';
import { OpenDisputesContext } from 'contexts/Store';

const RecentDisputes = ({ disputes }) => {
  const [, setOpenDisputes] = useContext(OpenDisputesContext);

  useEffect(() => {
    const initOpenDisputes = async () => {
      const openDisputes = disputes.filter(
        (dispute) => dispute.status === 'Open Dispute',
      );

      if (openDisputes.length) {
        setOpenDisputes(openDisputes);
      }
    };

    if (disputes) {
      initOpenDisputes();
    }
  }, [disputes]);

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
