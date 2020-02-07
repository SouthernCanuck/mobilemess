import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import RadioButton from 'components/forms/RadioButton';

import { selectors as inspectionSelectors, actions as inspectionActions } from 'ducks/inspection';
import { BackendFieldMap } from 'types/api/backendForm';
import { getDictionary } from 'helpers/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';


import { getValue } from 'helpers/multiValues';
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


class RadioField extends Component<Props> {
  private onChange = (id: string, index: number, value: string): void => {
    const { changeValue, path } = this.props;
    changeValue(id, index, value, path);
  }

  public render(): JSX.Element | null {
    const {
      id, path, index, dictionary, values, errors,
    } = this.props;

    const definitionId = getFieldDefinitionId(path);
    const config = dictionary[definitionId];
    if (!config) {
      console.debug('Radio field is not found', definitionId, index);
      return null;
    }
    const value = getValue(values, id, index) as string;
    const error = getValue(errors, id, index) as string;
    return (
      <>
        <Label>{config.labelText}</Label>
        {config.valueOptions!.map((option: string, i: number) => (
          <RadioButton
            key={option}
            id={id}
            path={path}
            index={index}
            value={option}
            name={config.options![i]}
            selected={value === option}
            onChange={this.onChange}
          />
        ))
        }
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
)(RadioField);
