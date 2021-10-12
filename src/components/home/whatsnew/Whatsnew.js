import React from 'react'
import './Whatsnew.scss'
import Blogpost from './Blogpost'
import Tellorprice from './Tellorprice'
import Tellorfeeds from './Tellorfeeds'

export default function Whatsnew() {
    return (
        <div className="Whatsnew">
            <Blogpost />
            <Tellorprice />
            <Tellorfeeds />
        </div>
    )
}
