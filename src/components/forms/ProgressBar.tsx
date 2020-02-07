import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import { font } from 'components/elements/typography';

interface Styles {
  style?: StyleSheet.NamedStyles<{}>;
}

export interface Progress {
  total: number;
  progress: number;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    height: 6,
    width: 100,
    marginRight: dimensions.spacing,
    borderRadius: 3,
    backgroundColor: '#E4E6F0',
  },
  progressValue: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
  },
  progressText: {
    ...font.semibold,
    fontSize: 9,
  },
});

const ProgressBar: React.FC<Styles & Progress> = ({ progress, total, style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.progress}>
      <View
        style={[
          styles.progressValue,
          { width: `${Math.floor((progress / total) * 100)}%` },
        ]}
      />
    </View>
    <Text style={styles.progressText}>{`${progress} / ${total}`}</Text>
  </View>
);

export default ProgressBar;
