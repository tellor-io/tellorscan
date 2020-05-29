import React, { useState, useEffect } from 'react';

import DisputesTable from './DisputesTable';

const OpenDisputes = ({ disputes }) => {
  const [openDisputes, setOpenDisputes] = useState([]);

  useEffect(() => {
    const initOpenDisputes = async () => {
      setOpenDisputes(
        disputes.filter((dispute) => dispute.status === 'Open Dispute'),
      );
    };

    if (disputes) {
      initOpenDisputes();
    }
  }, [disputes]);

  return (
    <div>
      <h2>Open Disputes</h2>
      <DisputesTable pagination={false} disputes={openDisputes} open={true} />
    </div>
  );
};

export default OpenDisputes;
