import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import { selectors as inspectionSelectors, actions as inspectionActions } from 'ducks/inspection';
import { getValue } from 'helpers/multiValues';
import { DATETIME_FORMAT, DATE_FORMAT, TIME_FORMAT } from 'config/datetimeConfig';
import { BackendFieldMap } from 'types/api/backendForm';
import { getDictionary } from 'helpers/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';

import { forms } from 'styles/partials';
import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { isIOS, isAndroid } from 'helpers/platform';
import { ButtonPrimary } from 'components/elements/buttons';
import { Modal } from 'components/elements/Modal';
import Label from 'components/forms/Label';
import { ValidationError } from 'components/forms/ValidationError';
import { getFieldDefinitionId } from 'helpers/fieldValue';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  input: {
    justifyContent: 'center',
  },
  date: {
    marginRight: dimensions.spacing,
  },
  modalContent: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 300,
    backgroundColor: colors.white,
  },
  buttonDone: {
    alignSelf: 'center',
  },
});

enum DateTimeMode {
  SHOW_DATE = 'date',
  SHOW_TIME = 'time'
}

interface StateProps {
  mode: DateTimeMode;
  showModal: boolean;
}

interface DispatchProps {
  changeValue: Function;
}

interface OwnProps {
  id: string;
  index?: number;
  path: FormPath;
}

interface ExternalProps {
  values: FieldValueMap;
  errors: FieldValueMap;
  dictionary: BackendFieldMap;
}

type Props = OwnProps & DispatchProps & ExternalProps

class DateTimeField extends Component<Props, StateProps> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      mode: DateTimeMode.SHOW_DATE,
      showModal: false,
    };
  }

  private hideDateTimeDialog = (): void => {
    this.setState({
      showModal: false,
    });
  }

  private showDateTimeDialog = (mode: DateTimeMode): void => {
    this.setState({
      mode,
      showModal: true,
    });
  }

  private setDate = (event: Event, date?: Date): void => {
    if (isAndroid()) {
      // on iOS native date time picker do not allow choose values (month and year) separately
      // so we can't close picker after each change
      this.hideDateTimeDialog();
    }

    const {
      id, index, changeValue, path,
    } = this.props;

    if (date) {
      const dateString = moment(date).format(DATETIME_FORMAT);
      changeValue(id, index, dateString, path);
    }
  }

  public render(): JSX.Element | null {
    const {
      id, index, values, errors, dictionary, path,
    } = this.props;
    const { showModal, mode } = this.state;

    const definitionId = getFieldDefinitionId(path);
    const config = dictionary[definitionId];
    if (!config) {
      console.debug('Datetime field is not found', id, index);
      return null;
    }
    const value = getValue(values, id, index) as string;
    const error = getValue(errors, id, index) as string;

    const momentDate = value ? moment(value, DATETIME_FORMAT, false) : moment();
    return (
      <>
        <Label>{config.labelText}</Label>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.showDateTimeDialog(DateTimeMode.SHOW_DATE)}
          >
            <View style={[forms.input, styles.input, styles.date]}>
              <Text>{momentDate.format(DATE_FORMAT)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.showDateTimeDialog(DateTimeMode.SHOW_TIME)}
          >
            <View style={[forms.input, styles.input]}>
              <Text>{momentDate.format(TIME_FORMAT)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isIOS() && (
          <Modal isOpen={showModal} closeAction={this.hideDateTimeDialog}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={momentDate.toDate()}
                mode={mode}
                is24Hour
                display="default"
                onChange={this.setDate}
              />
            </View>
            <ButtonPrimary
              title="OK"
              onPress={this.hideDateTimeDialog}
              style={styles.buttonDone}
            />
          </Modal>
        )}
        {isAndroid() && showModal && (
          <DateTimePicker
            value={momentDate.toDate()}
            mode={mode}
            is24Hour
            display="default"
            onChange={this.setDate}
          />
        )}
        <ValidationError error={error} />
      </>
    );
  }
}

export default connect<ExternalProps, DispatchProps>(
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
)(DateTimeField);
