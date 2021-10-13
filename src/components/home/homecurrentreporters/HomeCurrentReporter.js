import React from 'react'
import { truncateAddr } from 'utils/helpers';
import { Jazzicon } from '@ukstv/jazzicon-react';
import telliot from '../../../assets/Telliot_icon_whitebg.png';

export default function HomeCurrentReporter({data}) {
    if(data) {
        return (
            <div className="HomeCurrentReporter">
                <div className="HomeCurrentReporter__avatar_etc">
                    <div className="HomeCurrentReporter__avatar">
                        <Jazzicon address={data.reporter} />
                        <img className="HomeCurrentReporter__telliot" src={telliot} alt="Telliot icon" />
                    </div>
                </div>
                <div className="HomeCurrentReporter__txt">
                    <a href={"https://etherscan.io/address/"+data.reporter} target="_blank" rel="noopener noreferrer">{truncateAddr(data.reporter)}</a>
                    <h4>{data.symbols}</h4>
                </div>
            </div>
        )
    } else {
        return (
            <div className="HomeCurrentReporter">
                loading
            </div>
        )
    }
}
