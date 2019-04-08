import React from 'react';

import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col
} from 'reactstrap';
import cn from 'classnames';
import * as align from 'Constants/alignments';

import Loading from 'Components//Loading';

class Error extends React.Component {
  render() {
    const {
      error
    } = this.props;
    if(!error) {
      return null;
    }

    return (
      <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
        <Col md="8" className={cn(align.allCenter, align.noMarginPad, "rounded", "border", "border-danger", "bg-warning", "text-sz-md", "text-danger", "font-weight-bold")}>
          {error.message?error.message:error}
        </Col>
      </Row>
    )
  }
}

export default class ModalShell extends React.Component {
  render() {
    const {
      title,
      showing,
      loading,
      error,
      loadStatus
    } = this.props;

    return (
      <Modal isOpen={showing} toggle={this.props.cancel}
              className="modal-shell">
        <Loading loading={loading} status={loadStatus}/>

        <ModalHeader className={cn("modal-header", "text-light")}
                     toggle={this.props.cancel}>
                {title}
        </ModalHeader>
        <ModalBody>
          <Error error={error} />
          {this.props.children}
        </ModalBody>
      </Modal>
    )
  }
}
