import React from 'react';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import Menu from 'Components/TopMenu';
import Overview from './overview';
import Activity from './activity';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div className={cn("dashboard-container", align.topCenter, align.full)}>


        <Menu withLogo withSearch/>
        <Overview />
        <Activity />
        
      </div>
    )
  }
}
