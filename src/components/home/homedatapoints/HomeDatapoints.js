import React from 'react'
import './HomeDatapoints.scss'
import Datapoint from '../../shared/Datapoint/Datapoint';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function HomeDatapoints() {

    // //// DUMMY ////
    const dataPoints = [
        {
            timestamp: "1633959919",
            reporter: "0x1D39955c9662678535d68a966862A06956ea5644",
            symbols: "ETH/USD",
            value: "3957.33"
        },
        {
            timestamp: "1633959564",
            reporter: "0x1D39955c9662678535d68a966862A06956ea5644",
            symbols: "BTC/USD",
            value: "43761.1"
        },
        {
            timestamp: "1633959554",
            reporter: "0x1D39955c9662678535d68a966862A06956ea5644",
            symbols: "BNB/USD",
            value: "355.15"
        },
        {
            timestamp: "1633959582",
            reporter: "0x1D39955c9662678535d68a966862A06956ea5644",
            symbols: "BTC/USD 24h TWAP",
            value: "46102.277184"
        },
        {
            timestamp: "1633959584",
            reporter: "0x1D39955c9662678535d68a966862A06956ea5644",
            symbols: "ETH/BTC",
            value: "0.070664"
        }
    ]

    const datapointstotal = 55;

    return (
        <div className="HomeDatapoints">
            <div className="Datapoints">
                {dataPoints.map(data => {
                    return <Datapoint data={data}/>
                })}
            </div>
            <div className="btns">
                <Link to="/usetellor">
                    <Button size="large" className="bigbutton fxw">
                        use tellor’s datapoints
                    </Button>
                </Link>
                <Link to="/requestnew">
                    <Button size="large" className="bigbutton fxw">
                        request new datapoint
                    </Button>
                </Link>
                <Link to="/live" className="linktotal">
                    see all datapoints ({datapointstotal})
                </Link>
            </div>
        </div>
    )
}
