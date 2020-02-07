/* eslint-disable import/prefer-default-export */
import {
  StyleSheet,
} from 'react-native';
import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import { font } from 'components/elements/typography';

export const ModalSelectorStyles = StyleSheet.create({
  overlayStyle: {
    padding: '10%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
  },
  touchableStyle: {
    alignSelf: 'flex-start',
  },
  optionContainerStyle: {
    backgroundColor: colors.white,
    borderRadius: dimensions.borderRadius,
  },
  optionStyle: {
    padding: dimensions.spacing,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionTextStyle: {
    color: colors.blue,
    ...font.semibold,
  },
  cancelStyle: {
    backgroundColor: colors.white,
    borderRadius: dimensions.borderRadius,
  },
  cancelTextStyle: {
    ...font.semibold,
    textTransform: 'uppercase',
  },
});
