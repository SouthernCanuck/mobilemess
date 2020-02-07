import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { margins } from 'styles/margins';

export const font = {
  light: { fontFamily: 'Light' },
  regular: { fontFamily: 'Regular' },
  semibold: { fontFamily: 'Semibold' },
  bold: { fontFamily: 'Bold' },
};

const styles = StyleSheet.create({
  h1: {
    marginVertical: dimensions.spacing * 1.5,
    ...font.bold,
    fontSize: 22,
  },
  h2: {
    ...margins.heading,
    ...font.bold,
    fontSize: 18,
  },
  h3: {
    ...margins.heading,
    ...font.bold,
    fontSize: 13,
  },
  h4: {
    ...margins.heading,
    color: colors.blueDark,
    ...font.bold,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  label: {
    color: colors.label,
    ...font.regular,
    fontSize: 14,
  },
  status: {
    color: colors.blue,
    ...font.regular,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  bold: {
    ...font.bold,
  },
  labelBright: {
    marginBottom: dimensions.inputMargin,
    color: colors.white,
    ...font.regular,
    fontSize: 14,
  },
  comment: {
    ...font.regular,
    fontSize: 12,
    fontWeight: '200',
    color: colors.textLight,
  },
});

type TypoElement = React.ComponentProps<typeof Text>

export const H1: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.h1, style]} {...props} />
);

export const H2: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.h2, style]} {...props} />
);

export const H3: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.h3, style]} {...props} />
);

export const H4: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.h4, style]} {...props} />
);

export const Label: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.label, style]} {...props} />
);

export const Status: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.status, style]} {...props} />
);

export const Bold: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.bold, style]} {...props} />
);

export const LabelBright: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.labelBright, style]} {...props} />
);

export const Comment: React.FC<TypoElement> = ({ style, ...props }) => (
  <Text style={[styles.comment, style]} {...props} />
);
