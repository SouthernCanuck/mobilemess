import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from 'styles/colors';
import { font } from 'components/elements/typography';

const styles = StyleSheet.create({
  error: {
    color: colors.red,
    ...font.regular,
    fontSize: 12,
  },
});

export const ValidationError: React.FC<{ error: string | undefined }> = ({ error }) => error
  ? <Text style={styles.error}>{error}</Text>
  : null;
