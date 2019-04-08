import React from 'react';
import Modal from 'Components/Modal/ModalShell';
import SchemaForm from 'Components/SchemaForm';
import cn from 'classnames';
import * as align from 'Constants/alignments';
import {schema, uiSchema} from './FormSchema';
import {
  ModalFooter,
  Button,
  Row,
  Col
} from 'reactstrap';

class Exists extends React.Component {
  render() {
    const {
      id
    } = this.props;
    return (
      <Row className={cn(align.topCenter, align.full, "mb-4")}>
        <Col md="11" className={cn(align.topCenter, "p-3", "bg-warning", "rounded")}>
          <Row className={cn(align.topCenter, align.full)}>
            <Col md="12" className={cn(align.topCenter)}>
              <i className={cn("fa fa-warning", "text-dark", "mr-1", "text-sz-lg")} />
              <span className={cn("text-center", "text-sz-md", "text-dark", "font-weight-light")}>
                Entry already exists with id: {id}.
              </span>
              <span className={cn("mb-2", "text-center", "text-sz-md", "text-dark", "font-weight-light")}>
                Would you like to view the details for it now?
              </span>
              <Button type="button"
                      size="sm"
                      className={cn("text-dark", "bg-tellor-green")}
                      onClick={()=>this.props.showDetails(id)}>
                 Yes
              </Button>
            </Col>

          </Row>
        </Col>
      </Row>
    )
  }
}
export default class RequestModal extends React.Component {
  render() {
    const {
      data,
      showing,
      loading,
      error,
      entryExists
    } = this.props;

    return (
      <Modal title="Request Data"
             showing={showing}
             loading={loading}
             error={error}
             cancel={this.props.cancel}>
        <SchemaForm {...this.props}
                    className={cn("pr-5", "pl-5","w-100")}
                    validate={schema.validation}
                    onChange={e=>this.props.collect(e.formData)}
                    onSubmit={data=>this.props.onSubmit(data.formData)}
                    data={data}
                    schema={schema}
                    uiSchema={uiSchema}
                    liveValidate={false}>
              {
                entryExists &&
                <Exists {...this.props} id={entryExists} />
              }
              <ModalFooter className={cn(align.allCenter)}>
                <Button size="lg" className={cn("request-button", "bg-tellor-green", "text-white")}>
                  Submit
                </Button>
              </ModalFooter>
          </SchemaForm>
      </Modal>
    )
  }
}
