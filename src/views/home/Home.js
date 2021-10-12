import React from 'react'

import Whatsnew from 'components/home/whatsnew/Whatsnew'
import HomeDatapoints from 'components/home/homedatapoints/HomeDatapoints'
import HomeCurrentReporters from 'components/home/homecurrentreporters/HomeCurrentReporters'
import TforTelliot from 'components/home/tfortelliot/TforTelliot'
import OnlyAsDecentral from 'components/home/onlyasdecentral/OnlyAsDecentral'
import Bounties from 'components/shared/Bounties/Bounties'

export default function Home() {
    return (
        <div className="viewContainer">
            <Whatsnew />
            <HomeDatapoints />
            <HomeCurrentReporters />
            <TforTelliot />
            <OnlyAsDecentral />
            <Bounties />
        </div>
    )
}
