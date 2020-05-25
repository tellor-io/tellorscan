import React from 'react';

import DisputesTable from './DisputesTable';

const OpenDisputes = ({ disputes }) => {
  return (
    <div>
      <h2>Open Disputes</h2>
      <DisputesTable pagination={false} disputes={disputes} open={true} />
    </div>
  );
};

export default OpenDisputes;
