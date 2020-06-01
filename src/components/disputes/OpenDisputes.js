import React, { useContext } from 'react';

import DisputesTable from './DisputesTable';
import { OpenDisputesContext } from 'contexts/Store';

const OpenDisputes = () => {
  const [openDisputes] = useContext(OpenDisputesContext);

  return (
    <div>
      <h2>Open Disputes</h2>
      {openDisputes && (
        <DisputesTable pagination={false} disputes={openDisputes} open={true} />
      )}
    </div>
  );
};

export default OpenDisputes;
