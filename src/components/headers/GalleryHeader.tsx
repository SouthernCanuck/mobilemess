import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import icons from 'resources/icons';
import dimensions from 'styles/dimensions';

import { ButtonIcon, ButtonPrimary } from 'components/elements/buttons';
import { Bold } from 'components/elements/typography';

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
  button: {
    paddingHorizontal: dimensions.spacing,
  },
  buttonIcon: {
    marginHorizontal: dimensions.spacing * 2,
  },
});

const GalleryHeader = () => (
  <View style={styles.base}>
    <Text>Back to form</Text>
    <Bold>Photo gallery</Bold>
    <View style={styles.controls}>
      <ButtonPrimary title="Select photos" inverted style={styles.button} />
      <ButtonIcon
        icon={icons.trash}
        onPress={() => {}}
        style={styles.buttonIcon}
      />
    </View>
  </View>
);
export default GalleryHeader;
