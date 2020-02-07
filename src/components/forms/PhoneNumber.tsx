import React from 'react';
import {
  Text, Linking, StyleProp, TextStyle,
} from 'react-native';

interface Props {
  style: StyleProp<TextStyle>;
  phoneNumber: string;
}

const callPhone = (phoneNumber: string) => {
  Linking.openURL(`tel:${phoneNumber}`);
};

export default (props: Props) => {
  const {
    phoneNumber, style,
  } = props;

  if (!phoneNumber) {
    return null;
  }

  return (
    <Text
      style={style}
      onPress={() => callPhone(phoneNumber)}
    >
      {phoneNumber}
    </Text>
  );
};
