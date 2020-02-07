import React from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import InspectionType from 'types/inspectionType';
import FamilyInspectionView from 'components/inspections/FamilyInspectionView';
import UrarInspectionView from 'components/urarInspection/UrarInspectionView';
import PictureList from 'components/forms/PictureList';
import { selectors } from 'ducks/inspection';

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

const InspectionScreen = ({ navigation, isCameraRollShown }: NavigationInjectedProps & StateProps): JSX.Element => {
  const inspectionType: InspectionType = navigation.getParam('inspectionType');
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height" keyboardVerticalOffset={80} enabled>
      { inspectionType === InspectionType.SINGLE_FAMILY && <FamilyInspectionView /> }
      { inspectionType === InspectionType.URAR_INSPECTION && <UrarInspectionView />}
      { isCameraRollShown && <PictureList />}
    </KeyboardAvoidingView>
  );
};

const connectedComponent = connect<StateProps>(
  (state: any) => ({
    isCameraRollShown: selectors.isCameraRollShown(state),
  }),
)(InspectionScreen);

export default withNavigation(connectedComponent);
