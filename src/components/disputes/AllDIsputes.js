import React from 'react';

import DisputesTable from './DisputesTable';

const AllDisputes = ({ disputes }) => {
  return (
    <div>
      <h2>All Disputes</h2>
      <DisputesTable pagination={true} disputes={disputes} />
    </div>
  );
};

export default AllDisputes;
