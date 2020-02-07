import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import colors from 'styles/colors';
import { FormPath } from 'types/fieldValue';
import { font } from 'components/elements/typography';


const styles = StyleSheet.create({
  buttonWithText: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 3,
    alignItems: 'center',
  },
  radioInput: {
    height: 24,
    width: 24,
    marginRight: 5,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioInput: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
  text: {
    ...font.regular,
    fontSize: 14,
  },
});

interface Props {
  id: string;
  index?: number;
  name?: any;
  value: any;
  selected: boolean;
  path: FormPath;

  onChange: Function;
}

const RadioButton: React.FC<Props> = ({
  id, index, name, value, selected, onChange,
}) => (
  <TouchableOpacity
    onPress={() => onChange(id, index, value)}
  >
    <View style={styles.buttonWithText}>
      <View style={[styles.radioInput, { borderColor: selected ? colors.blue : colors.border }]}>
        {
          selected
            ? <View style={styles.selectedRadioInput} />
            : null
        }
      </View>
      <Text style={styles.text}>{name || value}</Text>
    </View>
  </TouchableOpacity>
);

export default RadioButton;
