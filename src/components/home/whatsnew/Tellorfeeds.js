import React from 'react'
import {ReactComponent as Github} from 'assets/Github.svg';
import {ReactComponent as Twitter} from 'assets/Twitter.svg';

export default function Tellorfeeds() {
    const githubrepo = "tellor-io/TellorPlayground"
    return (
        <div className="Tellorfeeds">
            <div className="Tellorfeed Tellorfeed__github">
                <div className="Tellorfeed__icon">
                <a href={"http://github.com/"+githubrepo} target="_blank" rel="noopener noreferrer"><Github /></a>
                </div>
                <div className="Tellorfeed__txt">
                    <a href={"http://github.com/"+githubrepo} target="_blank" rel="noopener noreferrer" >{githubrepo}</a>
                    <p className="bold">brendaloya - 9 jun</p>
                    <p>Merge pull request #7 from tkernell/dev1</p>
                </div>
            </div>
            <div className="Tellorfeed Tellorfeed__twitter">
                <div className="Tellorfeed__icon">
                    <a href="http://twitter.com/wearetellor" target="_blank" rel="noopener noreferrer">
                        <Twitter />
                    </a>
                </div>
                <div className="Tellorfeed__txt">
                    <p><a href="http://twitter.com/wearetellor" target="_blank" rel="noopener noreferrer">@WeAreTellor</a>  - 6 sept</p>
                    <p>gm tellor community🌞, ...</p>
                </div>
            </div>
        </div>
    )
}
