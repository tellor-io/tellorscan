import React from 'react';

import Form from 'react-jsonschema-form';

import {
  Row,
  Col
} from 'reactstrap';
import * as align from 'Constants/alignments';
import cn from 'classnames';

export default class SchemaForm extends React.Component {

  render() {
    const {
      data,
      schema,
      uiSchema,
      fields,
      className
    } = this.props;

    return (
      <Form
            className={className}
            schema={schema}
            formData={data}
            uiSchema={uiSchema}
            fields={fields}
            validate={this.props.validate}
            onChange={this.props.onChange}
            onSubmit={this.props.onSubmit}
            liveValidate={this.props.liveValidate}
            showErrorList={this.props.showErrorList||false}>
          {this.props.children}
      </Form>
    )
  }
}
