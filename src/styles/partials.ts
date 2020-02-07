import { IOS, ANDROID } from 'constants/platform';
import { font } from 'components/elements/typography';
import dimensions from './dimensions';
import colors from './colors';


const boxShadow = {
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
};

export const platformSpecific = {
  [IOS]: {
    boxShadow,
    cameraButton: {
      marginTop: dimensions.inputMargin,
      marginBottom: dimensions.spacing,
      alignSelf: 'flex-start',
      ...boxShadow,
    },
    workOrderBorder: {
      borderRadius: 6,
      borderLeftWidth: 5,
      borderTopWidth: 5,
      borderTopColor: '#FFF',
      borderBottomWidth: 5,
      borderBottomColor: '#FFF',
    },
  },
  [ANDROID]: {
    boxShadow: {
      elevation: 10,
    },
    workOrderBorder: {
      borderLeftWidth: 5,
      borderRadius: 5,
    },
  },
} as const;

export const forms = {
  input: {
    height: dimensions.inputHeight,
    marginVertical: dimensions.inputMargin,
    paddingHorizontal: dimensions.inputPadding,
    borderColor: colors.border,
    borderWidth: dimensions.inputBorder,
    borderRadius: dimensions.inputBorderRadius,
    color: colors.black,
    ...font.regular,
  },
};

export default {
  platformSpecific,
  forms,
};
