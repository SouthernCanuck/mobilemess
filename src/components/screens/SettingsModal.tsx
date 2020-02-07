import React from 'react';
import {
  StyleSheet, View, Linking, Text,
} from 'react-native';

import { legalConfig } from 'config/legalConfig';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import icons from 'resources/icons';
import { ButtonRound } from 'components/elements/buttons';
import { Modal } from 'components/elements/Modal';
import { H1, H4 } from 'components/elements/typography';

const styles = StyleSheet.create({
  modalContent: {
    minWidth: 360,
    paddingHorizontal: dimensions.spacing * 3,
    paddingVertical: dimensions.spacing,
  },
  heading: {
    marginTop: 0,
    marginRight: 60 + dimensions.spacing,
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  link: {
    marginVertical: dimensions.spacing,
    color: colors.link,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

const SettingsLink: React.FC<React.ComponentProps<typeof Text>> = ({ style, ...props }) => (
  <Text style={[styles.link, style]} {...props} />
);

interface OwnProps {
  isOpen: boolean;
  closeAction: () => void;
}

type Props = OwnProps

const SettingsModal: React.FC<Props> = ({ isOpen, closeAction }) => (
  <Modal isOpen={isOpen} closeAction={closeAction}>
    <View style={styles.modalContent}>
      <ButtonRound style={styles.close} icon={icons.close} onPress={closeAction} />
      <H1 style={styles.heading}>Account settings</H1>
      <H4>Legal</H4>
      <SettingsLink onPress={() => Linking.openURL(legalConfig.tac)}>Terms and conditions</SettingsLink>
      <SettingsLink onPress={() => Linking.openURL(legalConfig.pp)}>Privacy policy</SettingsLink>
    </View>
  </Modal>
);

export default SettingsModal;
