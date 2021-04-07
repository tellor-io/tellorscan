import React, { useState } from 'react';

import PricesModule from 'components/dashboard/prices-module/PricesModule';
import CurrentMiningModule from 'components/dashboard/current-mining-module/CurrentMiningModule';
import AllMiningModule from 'components/dashboard/all-mining-module/AllMiningModule';
import { useMediaQuery } from 'react-responsive';



const Dashboard = () => {
    const mobileBreaker = useMediaQuery({query: '(max-width: 800px)'});
    return(
        <div className="Dashboard">
            {mobileBreaker?
            <div className="firstContainer">
                <CurrentMiningModule />
                <div className="Prices_and_Tip">
                    <PricesModule />
                </div>
                <AllMiningModule />
            </div>
            :
            <div className="firstContainer">
                <div className="Current_and_All">
                    <CurrentMiningModule />
                    <AllMiningModule />
                </div>
                <div className="Prices_and_Tip">
                    <PricesModule />
                </div>
            </div>
            }


        </div>
    )
}

export default Dashboard;
