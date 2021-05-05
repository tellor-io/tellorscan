import React, { useState } from 'react';

import PricesModule from 'components/dashboard/prices-module/PricesModule';
import CurrentMiningModule from 'components/dashboard/current-mining-module/CurrentMiningModule';
import AllMiningModule from 'components/dashboard/all-mining-module/AllMiningModule';
import TipIdModule from 'components/dashboard/tipid-module/TipIdModule';
import { useMediaQuery } from 'react-responsive';



const Dashboard = ({ events, prices }) => {
    const mobileBreaker = useMediaQuery({query: '(max-width: 800px)'});
    return(
        <div className="Dashboard">
            {mobileBreaker?
            <div className="firstContainer">
                <CurrentMiningModule />
                <div className="Prices_and_Tip">
                    <TipIdModule />
                    <PricesModule prices={prices} />
                </div>
                <AllMiningModule events={events} />
            </div>
            :
            <div className="firstContainer">
                <div className="Current_and_All">
                    <CurrentMiningModule />
                    <AllMiningModule events={events}/>
                </div>
                <div className="Prices_and_Tip">
                    <TipIdModule />
                    <PricesModule prices={prices} />
                </div>
            </div>
            }
        </div>
    )
}

export default Dashboard;
