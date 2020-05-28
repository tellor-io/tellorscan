import React from 'react';

import DisputesTable from './DisputesTable';

const AllDisputes = ({ disputes }) => {
  return (
    <>
      <div className="TableHeader">
        <h2>All Disputes</h2>
      </div>
      <DisputesTable pagination={true} disputes={disputes} />
    </>
  );
};

export default AllDisputes;
