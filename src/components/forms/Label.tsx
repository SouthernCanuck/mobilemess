import React from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { font } from 'components/elements/typography';


const styles = StyleSheet.create({
  label: {
    marginBottom: dimensions.inputMargin,
    color: colors.black,
    ...font.semibold,
  },
});

const Label: React.FC = ({ children }) => <Text style={styles.label} numberOfLines={1}>{children}</Text>;

export default Label;
