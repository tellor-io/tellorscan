import React from 'react'
import {ReactComponent as Swoosh} from 'assets/Swoosh.svg';

export default function Tellorprice() {
    const price = "$45.54";
    return (
        <div className="Tellorprice">
          <Swoosh />
          <a href="https://coinmarketcap.com/currencies/tellor/" target="_blank" rel="noopener noreferrer">Tellor (TRB)</a>
          <p>{price}</p>
        </div>
    )
}
