import React from 'react'
import './Datapoint.scss';
import { truncateAddr } from 'utils/helpers';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

export default function Datapoint({data}) {
    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-US')
    const time = timeAgo.format(new Date(data.timestamp * 1000), 'round');

    return (
        <>
        {data?
        <div className="Datapoint">
            <div className="Datapoint__left">
                <p>{time} • by <a href={"https://etherscan.io/address/"+data.reporter} target="_blank" rel="noopener noreferrer">{truncateAddr(data.reporter)}</a></p>
                <h4>{data.symbols}</h4>
            </div>
            <div className="Datapoint__right">
                <h2>{data.value}</h2>
            </div>
        </div>
        :
        <div className="Datapoint">
            <p>Loading data</p>
        </div>
    }
    </>

    )
}
