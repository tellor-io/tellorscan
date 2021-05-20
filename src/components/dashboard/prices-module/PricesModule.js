import React from 'react';
import PricesList from 'components/dashboard/prices-module/PricesList';

const PricesModule = ({ prices }) => {
  return (
      <PricesList pagination={false} data={prices} />
  );
};

export default PricesModule;
