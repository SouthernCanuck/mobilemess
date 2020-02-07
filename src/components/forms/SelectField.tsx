import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { Entypo as Icon } from '@expo/vector-icons';

import { getValue } from 'helpers/multiValues';
import { selectors as inspectionSelectors, actions as inspectionActions } from 'ducks/inspection';
import { getDictionary } from 'helpers/backendForm';
import { BackendFieldMap } from 'types/api/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';
import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { forms } from 'styles/partials';
import { getFieldDefinitionId } from 'helpers/fieldValue';
import Label from './Label';
import { ValidationError } from './ValidationError';


const inputStyles = {
  ...forms.input,
  paddingVertical: 5,
  paddingRight: dimensions.inputPadding * 2,
};

const styles = StyleSheet.create({
  inputAndroid: inputStyles,
  inputIOS: {
    ...inputStyles,
    color: colors.black,
  },
  placeholder: {
    color: colors.placeholder,
  },
  iconContainer: {
    right: dimensions.inputPadding,
    top: 17,
  },
});


interface OwnProps {
  id: string;
  definitionId: string;
  index?: number;
  placeholder?: string;
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

const SelectIcon = (): JSX.Element => <Icon name="select-arrows" color={colors.black} />;

class SelectField extends Component<Props> {
  private onChange = (id: string, index: number, value: string, oldValue: string): void => {
    if (oldValue === value) {
      // react-native-picker-select bug
      // see https://github.com/lawnstarter/react-native-picker-select/issues/112
      return;
    }

    const { changeValue, path } = this.props;
    changeValue(id, index, value, path);
  }

  public render(): JSX.Element | null {
    const {
      id, index, values, dictionary, errors, placeholder, path,
    } = this.props;

    const definitionId = getFieldDefinitionId(path);
    const config = dictionary[definitionId];
    if (!config) {
      console.debug('Select field is not found', definitionId, index);
      return null;
    }
    const value = getValue(values, id, index) as string;
    const error = getValue(errors, id, index) as string;
    return (
      <>
        <Label>{config.labelText}</Label>
        <PickerSelect
          useNativeAndroidPickerStyle={false}
          style={styles}
          onValueChange={(text: string) => this.onChange(id, index!, text, value)}
          items={config.valueOptions!.map((option: string, i: number) => ({
            label: config.options![i],
            value: option,
          }))}
          value={value}
          Icon={SelectIcon}
          placeholder={{ label: placeholder || 'Select...', value: null }}
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
)(SelectField);
