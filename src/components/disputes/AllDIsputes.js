import React from 'react';

import DisputesTable from './DisputesTable';

const AllDisputes = ({ disputes }) => {
  return (
    <>
      <div className="TableHeader">
        <h2>Disputes</h2>
      </div>
      <DisputesTable pagination={false} disputes={disputes} />
    </>
  );
};

export default AllDisputes;
