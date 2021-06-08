import React, {useState, useEffect} from 'react';
import CurrentMiningSVGs from './CurrentMiningSVGs';
import { truncateAddr } from '../../../utils/helpers';

const CurrentMiner = ({miner, loading, minerstyle}) => {
    return(
    <>
    {miner?
        <div className={minerstyle ? "CurrentMiner CurrentMiner_"+minerstyle : "CurrentMiner"}>
            <p>{truncateAddr(miner)}</p>
            {minerstyle === "first"?
                <CurrentMiningSVGs.CurrentMiner_first_FULL />
            :null }
            {minerstyle === "second"?
                <CurrentMiningSVGs.CurrentMiner_second_FULL />
            :null }
            {minerstyle === "third"?
                <CurrentMiningSVGs.CurrentMiner_third_FULL />
            :null }
            {minerstyle === "fourth"?
                <CurrentMiningSVGs.CurrentMiner_fourth_FULL />
            :null }
            {minerstyle === "fifth"?
                <CurrentMiningSVGs.CurrentMiner_fifth_FULL />
            :null }
        </div>
    :
        <>
        {loading?
        <div className={minerstyle ? "CurrentMiner CurrentMiner_"+minerstyle : "CurrentMiner"}>
            {minerstyle === "first"?
                <CurrentMiningSVGs.CurrentMiner_first_EMPTY loading="true" />
            :null }
            {minerstyle === "second"?
                <CurrentMiningSVGs.CurrentMiner_second_EMPTY loading="true" />
            :null }
            {minerstyle === "third"?
                <CurrentMiningSVGs.CurrentMiner_third_EMPTY loading="true" />
            :null }
            {minerstyle === "fourth"?
                <CurrentMiningSVGs.CurrentMiner_fourth_EMPTY loading="true" />
            :null }
            {minerstyle === "fifth"?
                <CurrentMiningSVGs.CurrentMiner_fifth_EMPTY loading="true" />
            :null }
        </div>
        :
        <div className={minerstyle ? "CurrentMiner CurrentMiner_"+minerstyle : "CurrentMiner"}>

            {minerstyle === "first"?
                <CurrentMiningSVGs.CurrentMiner_first_EMPTY />
            :null }
            {minerstyle === "second"?
                <CurrentMiningSVGs.CurrentMiner_second_EMPTY />
            :null }
            {minerstyle === "third"?
                <CurrentMiningSVGs.CurrentMiner_third_EMPTY />
            :null }
            {minerstyle === "fourth"?
                <CurrentMiningSVGs.CurrentMiner_fourth_EMPTY />
            :null }
            {minerstyle === "fifth"?
                <CurrentMiningSVGs.CurrentMiner_fifth_EMPTY />
            :null }
        </div>
        }
        </>
    }
    </>
    )
};

export default CurrentMiner;
