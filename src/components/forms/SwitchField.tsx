import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet, View, Text, Switch,
} from 'react-native';

import { getValue } from 'helpers/multiValues';
import { selectors as inspectionSelectors, actions as inspectionActions } from 'ducks/inspection';
import { getDictionary } from 'helpers/backendForm';
import { BackendFieldMap } from 'types/api/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';
import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { isIOS } from 'helpers/platform';
import { getFieldDefinitionId } from 'helpers/fieldValue';
import Label from './Label';
import { ValidationError } from './ValidationError';

const styles = StyleSheet.create({
  wrapper: {
    height: dimensions.inputHeight,
    marginVertical: dimensions.inputMargin,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iosSwitch: {
    marginHorizontal: dimensions.inputMargin,
    transform: [
      { scaleX: 0.85 },
      { scaleY: 0.85 },
    ],
  },
});

interface OwnProps {
  id: string;
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

class SwitchField extends Component<Props> {
  private onChange = (id: string, index: number, value: boolean): void => {
    const { changeValue, path } = this.props;
    changeValue(id, index, value.toString(), path);
  }

  public render(): JSX.Element | null {
    const {
      id, index, values, dictionary, errors, path,
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
        <View style={styles.wrapper}>
          <Text>{config.options![1]}</Text>
          <Switch
            trackColor={{ false: colors.switchTrack, true: colors.border }}
            thumbColor={colors.blue}
            onValueChange={(newValue: boolean) => this.onChange(id, index!, newValue)}
            value={value === 'true'}
            style={isIOS ? styles.iosSwitch : null}
          />
          <Text>{config.options![0]}</Text>
        </View>
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
)(SwitchField);
