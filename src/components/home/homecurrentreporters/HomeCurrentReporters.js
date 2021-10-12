import React from 'react'
import './HomeCurrentReporters.scss'
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {ReactComponent as Chains} from 'assets/Chains.svg';


export default function HomeCurrentReporters() {
    return (
        <div className="HomeCurrentReporters">
            <div className="HomeCurrentReporters__illustration">
                <div className="HomeCurrentReporters__illustration__reporters">
                    <div className="HomeCurrentReporters__illustration__reporters__top">
                        <div className="HomeCurrentReporters__illustration__reporters__slider"></div>
                    </div>
                    <div className="HomeCurrentReporters__illustration__reporters__bottom">
                    <div className="HomeCurrentReporters__illustration__reporters__slider"></div>
                    </div>
                {/* <Link to="/becomereporter">reporters</Link> */}
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
