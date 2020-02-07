import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import images from 'resources/images';
import dimensions from 'styles/dimensions';

import OpenGallery from 'components/headers/OpenGallery';
import SyncButton from 'components/headers/SyncButton';
import RemoveButton from 'components/headers/RemoveButton';

const styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const InspectionHeader = (): JSX.Element => (
  <View style={styles.base}>
    <Image source={images.logo} />

    <View style={styles.controls}>
      <OpenGallery />
      <SyncButton />
      <RemoveButton />
    </View>
  </View>
);
export default InspectionHeader;
