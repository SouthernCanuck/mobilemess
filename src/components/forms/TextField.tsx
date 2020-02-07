import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TextInput } from 'react-native';

import { selectors as inspectionSelectors, actions as inspectionActions } from 'ducks/inspection';
import {
  BackendFieldMap, BackendFieldDefinition,
} from 'types/api/backendForm';
import { getDictionary, isNumeric, isCurrency } from 'helpers/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';

import { getValue } from 'helpers/multiValues';
import { forms } from 'styles/partials';

import { getFieldDefinitionId } from 'helpers/fieldValue';
import Label from './Label';
import { ValidationError } from './ValidationError';

interface OwnProps {
  id: string;
  index?: number;
  path: FormPath;
}

interface StateProps {
  values: FieldValueMap;
  errors: FieldValueMap;
  dictionary: BackendFieldMap;
}

interface DispatchProps {
  changeValue: Function;
}
type Props = OwnProps & StateProps & DispatchProps;

const formatInput = (
  oldValue: (string | undefined),
  value: (string | undefined),
  config: BackendFieldDefinition,
): string | undefined => {
  if (!value) {
    return value;
  }

  if (isNumeric(config)) {
    if (/^\d*$/.test(value.toString())) {
      return value;
    }

    return oldValue;
  }

  if (isCurrency(config)) {
    if (/^((\d*)(\.\d{0,2})?)$/.test(value.toString())) {
      return value;
    }

    return oldValue;
  }

  return value;
};

class TextField extends Component<Props> {
  private onChange = (id: string, index: number, value: string | undefined): void => {
    const { changeValue, path } = this.props;
    changeValue(id, index, value, path);
  }

  public render(): JSX.Element | null {
    const {
      path, id, index, values, dictionary, errors,
    } = this.props;

    const definitionId = getFieldDefinitionId(path);
    const config = dictionary[definitionId];
    if (!config) {
      console.debug('Text field is not found', definitionId, index);
      return null;
    }

    const value = getValue(values, id, index) as (string | undefined);
    const error = getValue(errors, id, index) as (string | undefined);

    return (
      <>
        <Label>{config.labelText}</Label>
        <TextInput
          style={forms.input}
          onChangeText={(text: string) => this.onChange(
            id,
            index!,
            formatInput(value, text, config),
          )}
          value={value}
          keyboardType={isNumeric(config) ? 'numeric' : 'default'}
        />
        <ValidationError error={error} />
      </>
    );
  }
}

export default connect<StateProps, DispatchProps>(
  (state: any) => ({
    values: inspectionSelectors.getValues(state),
    errors: inspectionSelectors.getErrors(state),
    dictionary: getDictionary(),
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      changeValue: inspectionActions.changeValue,
    },
    dispatch,
  ),
)(TextField);
