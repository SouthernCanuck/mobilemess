import React from 'react';
import { StyleSheet } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { Entypo as Icon } from '@expo/vector-icons';

import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { LabelBright as Label } from 'components/elements/typography';

const inputStyles = {
  height: dimensions.inputHeight,
  marginVertical: dimensions.inputMargin,
  paddingVertical: 5,
  paddingLeft: dimensions.inputPadding,
  paddingRight: dimensions.inputPadding * 3,
  borderWidth: 0,
  borderRadius: dimensions.inputBorderRadius,
  backgroundColor: colors.inputs.dark,
  color: colors.white,
};

const styles = StyleSheet.create({
  inputAndroid: inputStyles,
  inputIOS: inputStyles,
  iconContainer: {
    right: dimensions.inputPadding,
    top: 17,
  },
});

interface Props {
  items: any;
  value: string;
  label: string;
  placeholder?: {};

  onChange: Function;
  onDonePress: Function;
}

const SelectIcon: React.FC = () => <Icon name="select-arrows" color={colors.white} />;

const SelectFieldWhite: React.FC<Props> = (props: Props) => {
  const {
    items, value, label, onChange, onDonePress, placeholder,
  } = props;

  return (
    <>
      <Label>{label}</Label>
      <PickerSelect
        useNativeAndroidPickerStyle={false}
        style={styles}
        onValueChange={(text: string) => {
          if (value !== text) {
            onChange(text);
          }
        }}
        items={items}
        value={value}
        Icon={SelectIcon}
        placeholder={placeholder}
        onDonePress={() => onDonePress()}
      />
    </>
  );
};

export default SelectFieldWhite;
