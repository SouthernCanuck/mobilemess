import React from 'react';
import {
  Modal as NativeModal, StyleSheet, TouchableWithoutFeedback, View,
} from 'react-native';

import colors from 'styles/colors';
import dimensions from 'styles/dimensions';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    maxHeight: '90%',
    maxWidth: '90%',
    backgroundColor: colors.white,
    borderRadius: dimensions.borderRadius,
    paddingVertical: dimensions.spacing,
  },
});

interface ModalProps {
  isOpen: boolean;
  closeAction: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, isOpen, closeAction }) => (
  <NativeModal
    animationType="fade"
    transparent
    visible={isOpen}
    onRequestClose={closeAction}
    onDismiss={closeAction}
  >
    <TouchableWithoutFeedback onPress={closeAction}>
      <View style={styles.wrapper}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </NativeModal>
);
