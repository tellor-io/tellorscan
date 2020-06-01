import React, { useContext } from 'react';

import DisputesTable from './DisputesTable';
import { OpenDisputesContext } from 'contexts/Store';

const OpenDisputes = () => {
  const [openDisputes] = useContext(OpenDisputesContext);

  return (
    <div>
      <div className="TableHeader">
        <h2>Open Disputes</h2>
      </div>
      {openDisputes && (
        <DisputesTable pagination={false} disputes={openDisputes} open={true} />
      )}
    </div>
  );
};

export default OpenDisputes;
