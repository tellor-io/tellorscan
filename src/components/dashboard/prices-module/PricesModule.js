import React, { useState, useEffect, useContext } from 'react';
import PricesTable from 'components/dashboard/prices-module/PricesTable';
import { NetworkContext } from 'contexts/Network';
import { chains } from 'utils/chains';

const getPrices = async (setPrices, currentNetwork) => {
  try {
    fetch(chains[currentNetwork].apiURL + "/prices")
      .then(response => response.json())
      .then(data => {
        setPrices(data)
      }
      );
  } catch (e) {
    console.error('error', e);
  }
};


const PricesModule = () => {
  const [currentNetwork] = useContext(NetworkContext);

  const [prices, setPrices] = useState(false);

  useEffect(() => {
    getPrices(setPrices, currentNetwork)
  }, [currentNetwork])

  return (
    <div className="Prices">
      <PricesTable pagination={false} data={prices} />
    </div>
  );
};

export default PricesModule;