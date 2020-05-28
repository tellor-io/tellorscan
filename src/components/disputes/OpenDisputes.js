import React, { useState, useEffect } from 'react';
import moment from 'moment';

import DisputesTable from './DisputesTable';

const OpenDisputes = ({ disputes }) => {
  const [openDisputes, setOpenDisputes] = useState([]);

  useEffect(() => {
    const initOpenDisputes = async () => {
      const open = disputes.filter((dispute) => {
        return moment
          .utc()
          .isBefore(moment.unix(dispute.timestamp).add(7, 'days'));
      });

      setOpenDisputes(open);
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
