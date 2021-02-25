import React, { useState, useEffect, useContext } from 'react';
import PricesTable from 'components/prices/PricesTable';
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


const Prices = () => {
  const [currentNetwork] = useContext(NetworkContext);

  const [prices, setPrices] = useState(false);

  useEffect(() => {
    getPrices(setPrices, currentNetwork)
  }, [currentNetwork])

  return (
    <>
      <div className="View">
        <div className="TableHeader">
          <h2>Latest Prices</h2>
        </div>
        <PricesTable pagination={false} data={prices} />
      </div>
    </>
  );
};

export default Prices;
