import React from 'react';
import Modal from 'Components/Modal/ModalShell';
import SchemaForm from 'Components/SchemaForm';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {schema} from './FormSchema';
import {
  ModalFooter,
  Button,
  Row,
  Col
} from 'reactstrap';

class Meta extends React.Component {
  render() {
    const {
      request
    } = this.props;
    let qStr = request.queryString;
    if(qStr.length > 40) {
      let s = qStr.substring(0,Math.floor(qStr.length/2)) + "..." + qStr.substring(qStr.length-5);
      qStr = s;
    }
    return (
      <Row className={cn("border-bottom", "border-muted", "mb-3", align.topCenter, align.full, align.noMarginPad)}>
        <Col md="12" className={cn(align.topCenter, align.noMarginPad)}>
          <Row className={cn(align.allCenter, align.full, align.noMarginPad)}>
            <Col md="3" className={cn(align.leftCenter, "pr-2", align.noMarginPad)}>
              <span className={cn("text-right", "text-muted", "text-sz-1")}>
                Request ID
              </span>
            </Col>
            <Col md="9" className={cn(align.leftCenter, align.noMarginPad)}>
              <span className={cn("text-left", "font-weight-bold", "text-sz-1")}>
                {request.id}
              </span>
            </Col>
          </Row>

          <Row className={cn(align.allCenter, align.full, "pb-2", align.noMarginPad)}>
            <Col md="3" className={cn(align.leftCenter, "pr-2", align.noMarginPad)}>
              <span className={cn("text-right", "text-muted", "text-sz-1")}>
                Query
              </span>
            </Col>
            <Col md="9" className={cn(align.leftCenter, align.noMarginPad)}>
              <span className={cn("text-left", "font-weight-bold", "text-sz-1")}>
                {qStr}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
export default class TipModal extends React.Component {
  render() {
    const {
      data,
      showing,
      loading,
      error,
      request
    } = this.props;

    return (
      <Modal title="Add Tip"
             className={cn("tip-modal")}
             showing={showing}
             loading={loading}
             error={error}
             cancel={this.props.cancel}>
        <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
          <Col md="11" className={cn(align.topCenter)}>
            <Meta request={request}/>

              <SchemaForm {...this.props}
                        className={cn("w-100")}
                        validate={schema.validation}
                        onChange={e=>this.props.collect(e.formData)}
                        onSubmit={data=>this.props.onSubmit(data.formData)}
                        data={data}
                        schema={schema}
                        liveValidate={false}>
                  <ModalFooter className={cn(align.allCenter)}>
                    <Button size="lg" className={cn("request-button", "bg-tellor-green", "text-white")}>
                      Submit
                    </Button>
                  </ModalFooter>
              </SchemaForm>

            </Col>
          </Row>
      </Modal>
    )
  }
}
