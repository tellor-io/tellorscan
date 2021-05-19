import React from 'react';
import PricesTable from 'components/dashboard/prices-module/PricesTable';

const PricesModule = ({ prices }) => {
  return (
      <PricesTable pagination={false} data={prices} />
  );
};

export default PricesModule;
