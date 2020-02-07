import React, { useState, useEffect, useCallback } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import SelectMultiple from 'react-native-select-multiple';
import { Entypo as Icon } from '@expo/vector-icons';

import { getValue } from 'helpers/multiValues';
import { selectors as inspectionSelectors, actions as inspectionActions } from 'ducks/inspection';
import { getDictionary } from 'helpers/backendForm';
import { BackendFieldMap, BackendFieldDefinition } from 'types/api/backendForm';
import { FieldValueMap, FormPath } from 'types/fieldValue';
import { Row } from 'components/elements/containers';
import { ButtonSmall } from 'components/elements/buttons';
import { Modal } from 'components/elements/Modal';
import { forms } from 'styles/partials';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import { getFieldDefinitionId } from 'helpers/fieldValue';
import Label from './Label';
import { ValidationError } from './ValidationError';


const styles = StyleSheet.create({
  input: {
    ...forms.input,
    paddingVertical: dimensions.inputPadding / 2,
    paddingRight: dimensions.inputPadding * 2,
    flex: 1,
  },
  error: {
    color: 'red',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    maxHeight: '90%',
    maxWidth: '90%',
    backgroundColor: colors.white,
    borderRadius: dimensions.borderRadius,
    paddingVertical: dimensions.spacing,
  },
  multiSelect: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 300,
    backgroundColor: colors.white,
  },
  placeholder: {
    color: colors.placeholder,
  },
  icon: {
    position: 'absolute',
    top: 11,
    right: 10,
  },
  row: {
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    paddingVertical: dimensions.inputPadding,
  },
  checkbox: {
    tintColor: colors.blue,
    opacity: 1,
  },
  selectedLabel: {
    color: colors.blue,
  },
  buttons: {
    flex: 0,
    justifyContent: 'space-around',
    paddingVertical: dimensions.spacing,
  },
});

interface OwnProps {
  id: string;
  index?: number;
  maxSelect?: number;
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

interface Item {
  label: string;
  value: string;
}

type Items = Item[];

const getSelectedValues = (
  config: BackendFieldDefinition,
  valuesArray?: string[],
): Items => {
  if (!valuesArray) {
    return [];
  }

  return valuesArray.map(value => {
    const index = config.valueOptions!.findIndex(valueOption => (valueOption === value));
    return {
      label: config.options![index],
      value: config.valueOptions![index],
    };
  });
};

const MultiSelectField = (props: Props): JSX.Element | null => {
  const {
    id, index, path, values, dictionary, changeValue, errors, maxSelect, placeholder = 'Select...',
  } = props;
  const definitionId = getFieldDefinitionId(path);
  const config = dictionary[definitionId];
  if (!config) {
    console.debug('MultiSelect field is not found', id, index);
    return null;
  }
  const selectedValues = getValue(values, id, index) as string[];
  const value: Items = getSelectedValues(config, selectedValues);
  const error = getValue(errors, id, index) as string;

  const [isOpen, setOpen] = useState(false);
  const [selectedItems, setSelected] = useState<Items>(value);

  useEffect(() => {
    const multiSelectItems = getSelectedValues(config, getValue(values, id, index) as string[]);
    setSelected(multiSelectItems);
  }, [values]);

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = (): void => {
    changeValue(id, index, selectedItems.map(item => item.value), path);
    setOpen(false);
  };
  const unselectAll = useCallback(() => setSelected([]), [setSelected]);

  return (
    <>
      <Label>{config.labelText}</Label>
      <View>
        <TouchableOpacity onPress={open} activeOpacity={0.75}>
          <View style={styles.input}>
            {value.length ? (
              <Text numberOfLines={1} ellipsizeMode="tail">
                {value.map((item: Item) => item.label).join(', ')}
              </Text>
            ) : (
              <Text
                style={styles.placeholder}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {placeholder}
              </Text>
            )}
            <Icon name="select-arrows" color={colors.black} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <Modal isOpen={isOpen} closeAction={close}>
          <SelectMultiple
            items={config.options?.map((option, i) => ({
              label: option,
              value: config.valueOptions![i],
            }))}
            selectedItems={selectedItems}
            onSelectionsChange={(items: Items) => setSelected(items)}
            maxSelect={maxSelect}
            style={styles.multiSelect}
            rowStyle={styles.row}
            checkboxStyle={styles.checkbox}
            selectedLabelStyle={styles.selectedLabel}
          />
          <Row style={styles.buttons}>
            <ButtonSmall onPress={close}>Close</ButtonSmall>
          </Row>
          <Row style={styles.buttons}>
            <ButtonSmall onPress={unselectAll}>Unselect all</ButtonSmall>
          </Row>
        </Modal>
      </View>
      <ValidationError error={error} />
    </>
  );
};

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
)(MultiSelectField);
