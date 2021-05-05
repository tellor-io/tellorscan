import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Detail = ({ events, prices }) => {
    const location = useLocation();
    const key = location.pathname.split('/')[2];
    const [priceData,setPriceData] = useState(null);


    useEffect(() => {
    let pricesfiltered;
    let eventsfiltered;
    if(key && prices) {
        for (var i=0; i < prices.length; i++) {
            if (prices[i].id === key) {
                pricesfiltered = prices[i];
            }
        }
        setPriceData({
            ...priceData,
            name: pricesfiltered.name,
            timestamp: pricesfiltered.timestamp,
            tip: pricesfiltered.tip,
            value: pricesfiltered.value
        });
    }
    if(key && events && events.miningEvents) {
        for (var i=0; i < events.miningEvents.length; i++) {
            const test  = events.miningEvents[i].requestIds;
            for (var j=0; j < events.miningEvents[i].requestIds.length; j++) {
                if(events.miningEvents[i].requestIds[j] === key) {
                    console.log("whatwhat");
                }
            }
        }
    }


    },[key,events,prices]);


    console.log("priceData",priceData);

    return(
        <div className="Detail">
            {priceData?
            <p>{priceData.name}</p>
            :
            "none found"
            }
        </div>
    )
}

export default Detail;
