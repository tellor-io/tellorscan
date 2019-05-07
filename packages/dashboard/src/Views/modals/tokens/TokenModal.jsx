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

export default class TokenModal extends React.Component {
  render() {
    const {
      data,
      showing,
      loading,
      error
    } = this.props;

    return (
      <Modal title="Request Tokens"
             className={cn("token-modal")}
             showing={showing}
             loading={loading}
             error={error}
             cancel={this.props.cancel}>
        <Row className={cn(align.topCenter, align.full, align.noMarginPad)}>
          <Col md="11" className={cn(align.topCenter)}>

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
