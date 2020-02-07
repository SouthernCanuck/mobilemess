import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Label, font } from 'components/elements/typography';
import colors from 'styles/colors';

const styles = StyleSheet.create({
  workOrderProperty: {
    flex: 1,
  },
  text: {
    color: colors.black,
    fontSize: 14,
    ...font.regular,
  },
});

interface Props {
  name: string;
  value: string;
}

export default (props: Props) => {
  const { name, value } = props;

  return (
    <View style={styles.workOrderProperty}>
      <Label>{name}</Label>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};
