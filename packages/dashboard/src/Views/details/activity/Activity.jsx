import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {formatTime} from 'Utils/time';
import ReactTable from 'react-table';
import ChallengeViewer from 'Components/ChallengeViewer/ChallengeViewer';

export default class Activity extends React.Component {

  componentWillMount() {
    if(this.props.needsSearch && (!this.props.metadata || !this.props.metadata.id)) {
      //need to initialize
      this.props.doSearch();
    }
  }

  render() {
    const {
      challenges
    } = this.props;

    /*
    <Col md="10" className={cn("activity-table-container", "rounded", align.allCenter, "p-3", "m-0", "p-0")}>
      <ReactTable data={rows} columns={cols}
                  defaultPageSize={pageSize}
                  pageSize={pageSize}
                  pages={totalPages}
                  page={page}
                  loading={loading}
                  manual={true}
                  defaultSorted={sorting}
                  onPageChange={this.props.nextPage}
                  onPageSizeChange={this.props.setPageSize}
                  onSortedChange={this.props.setSort}
                  noDataText="No recent events"
                  className="w-100 m-0 p-0 -striped -highlight" />
    </Col>
    */

    return (
      <Row className={cn("activity-table-container",align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <div className={cn("activity-header", "bg-tellor-charcoal", "text-white", align.leftCenter, align.full)}>
            <span className={cn("pl-4", "font-weight-bold", "text-sz-md", "text-light")}>
              Recent Requests
            </span>
          </div>
        </Col>
        <Col md="12" className={cn(  align.rightCenter,align.noMarginPad)}>
          <ChallengeViewer noId noSymbol challenges={challenges} />
        </Col>

      </Row>
    )
  }


}
