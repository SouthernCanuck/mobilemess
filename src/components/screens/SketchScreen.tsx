import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { selectors } from 'ducks/inspection';
import SketchView from 'components/sketch/SketchView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

interface StateProps {
  isCameraRollShown: boolean;
}

const SketchScreen = ({ navigation, isCameraRollShown }: NavigationInjectedProps & StateProps) => {
  const sketchId: string = navigation.getParam('sketchId');
  return (
    <View style={styles.container}>
      <SketchView sketchId={sketchId} />
    </View>
  );
};

const connectedComponent = connect<StateProps>(
  (state: any) => ({
    isCameraRollShown: selectors.isCameraRollShown(state),
  }),
)(SketchScreen);

export default withNavigation(connectedComponent);
