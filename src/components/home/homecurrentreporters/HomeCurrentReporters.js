import React from 'react'
import './HomeCurrentReporters.scss'
import HomeCurrentReporter from '../homecurrentreporters/HomeCurrentReporter';

import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {ReactComponent as Chains} from 'assets/Chains.svg';


export default function HomeCurrentReporters() {

    // //// DUUMY ////
    const testdata = {
        reporter: "0x88C1F97348DA216c2deD7A3A92274f2Ff5cf3111",
        symbols: "ETH/USD"
    }
    const testdata2 = {
        reporter: "0x4DC1F97348DA216c2deD7A3A92274f2Ff5cf3422",
        symbols: "BTC/USD"
    }


    
    return (
        <div className="HomeCurrentReporters">
            <div className="HomeCurrentReporters__illustration">
                <div className="currentReporter__top">
                    <HomeCurrentReporter data={testdata} />
                </div>
                <div className="currentReporter__bottom">
                    <HomeCurrentReporter data={testdata2} />
                </div>
                <div className="reporters_and_link">
                    <div className="reporters">
                        <div className="reporters__top">
                            <div className="slider"></div>
                        </div>
                        <div className="reporters__bottom">
                            <div className="slider"></div>
                        </div>
                    </div>
                    <Link to="/becomereporter">reporters</Link>
                </div>
                <div className="chains">
                    <Chains />
                    <Link to="/howitworks">chains</Link>
                </div>
            </div>
            <div className="horizontal_btns">
                <Link to="/howitworks">
                    <Button size="large" className="bigbutton blackbutton fxw">
                        see how it works
                    </Button>
                </Link>
                <Link to="/becomereporter">
                    <Button size="large" className="bigbutton  blackbutton fxw">
                        become a data reporter
                    </Button>
                </Link>
            </div>
        </div>
    )
}
