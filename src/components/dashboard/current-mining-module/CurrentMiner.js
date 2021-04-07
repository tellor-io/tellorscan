import React, {useState, useEffect} from 'react';

const CurrentMiner = ({miner}) => {
    return(
    <>
    {miner?
        <div className="CurrentMiner">
            <p>{miner}</p>
        </div>
    :
        <div className="CurrentMiner">
            <p>no miner</p>
        </div>
    }
    </>
    )
};

export default CurrentMiner;
