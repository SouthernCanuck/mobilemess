import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, GestureResponderEvent,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import { font } from './typography';


export const styles = StyleSheet.create({
  round: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: dimensions.spacing / 2,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundText: {
    ...font.light,
    fontSize: 10,
  },
  primary: {
    height: dimensions.inputHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: dimensions.inputPadding * 2,
    paddingVertical: 0,
    backgroundColor: colors.blue,
    borderRadius: dimensions.borderRadius,
  },
  primaryInverted: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  primaryText: {
    marginHorizontal: dimensions.inputMargin,
    color: colors.white,
    ...font.bold,
    fontSize: 14,
  },
  primaryTextInverted: {
    color: colors.blue,
  },
  small: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: dimensions.inputPadding * 2,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.white,
    elevation: 6,
  },
  smallText: {
    ...font.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

interface ButtonProps {
  style?: StyleSheet.NamedStyles<{}>;
  icon?: string;
  onPress?: ((event: GestureResponderEvent) => void);
}

interface ButtonPrimaryProps {
  title?: string;
  iconPosition?: 'left' | 'right';
  inverted?: boolean;
}

export const ButtonRound: React.FC<ButtonProps> = ({
  children, icon, style, onPress,
}) => (
  <TouchableOpacity style={[styles.round, style]} onPress={onPress}>
    {icon
      ? <SvgXml width={24} height={24} xml={icon} />
      : <Text style={[styles.roundText]}>{children}</Text>
    }
  </TouchableOpacity>
);

export default ButtonRound;

export const ButtonPrimary: React.FC<ButtonProps & ButtonPrimaryProps> = ({
  children, icon, style, title, onPress, iconPosition, inverted,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.primary,
      inverted ? styles.primaryInverted : null,
      iconPosition === 'right' ? { flexDirection: 'row-reverse' } : null,
      style,
    ]}
  >
    {icon && <SvgXml width={24} height={24} xml={icon} />}
    {title && (
      <Text style={[styles.primaryText, inverted ? styles.primaryTextInverted : null]}>
        {title}
      </Text>
    )}
    {children}
  </TouchableOpacity>
);

export const ButtonSmall: React.FC<ButtonProps> = ({
  children, icon, style, onPress,
}) => (
  <TouchableOpacity style={[styles.small, style]} onPress={onPress}>
    {icon
      ? <SvgXml width={20} height={20} xml={icon} />
      : <Text style={[styles.smallText]}>{children}</Text>
    }
  </TouchableOpacity>
);

export const ButtonIcon: React.FC<ButtonProps> = ({ icon, onPress, style }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    { icon && <SvgXml width={24} height={24} xml={icon} /> }
  </TouchableOpacity>
);
