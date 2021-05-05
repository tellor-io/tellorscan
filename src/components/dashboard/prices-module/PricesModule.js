import React from 'react';
import PricesTable from 'components/dashboard/prices-module/PricesTable';

const PricesModule = ({ prices }) => {
  return (
    <div className="Prices">
      <PricesTable pagination={false} data={prices} />
    </div>
  );
};

export default PricesModule;
