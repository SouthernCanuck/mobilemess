import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet,
} from 'react-native';

import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import ModalSelector from 'react-native-modal-selector';
import { actions } from 'ducks/inspection';
import ButtonRound from 'components/elements/buttons';
import colors from 'styles/colors';
import dimensions from 'styles/dimensions';
import routeNames from 'constants/routeNames';
import icons from 'resources/icons';
import { ModalSelectorStyles } from 'components/images/ModalStyles';

const styles = StyleSheet.create({
  removeButton: {
    backgroundColor: colors.inputs.dark,
    marginLeft: dimensions.spacing * 2,
  },
});

const REMOVE_CONFIRMED = 'Remove Image';

interface Method {
  key: string;
  label: string;
}
const METHODS: Method[] = [
  { key: REMOVE_CONFIRMED, label: REMOVE_CONFIRMED },
];

interface OwnProps {
  fieldId: string;
  fieldIndex?: number;
}
interface DispatchProps {
  removeValue: Function;
}
type Props = OwnProps & DispatchProps & NavigationInjectedProps;

class RemoveImageButton extends Component<Props> {
  private onMethodSelect(method: string): void {
    if (method === REMOVE_CONFIRMED) {
      this.removePicture();
    }
  }

  private removePicture(): void {
    const {
      navigation, removeValue, fieldId, fieldIndex,
    } = this.props;
    removeValue(fieldId, fieldIndex);
    navigation.navigate(routeNames.INSPECTION);
  }

  public render(): JSX.Element {
    return (
      <ModalSelector
        data={METHODS}
        onChange={(method: Method) => this.onMethodSelect(method.key)}
        animationType="fade"
        backdropPressToClose
        {...ModalSelectorStyles}
      >
        <ButtonRound
          icon={icons.trash}
          style={styles.removeButton}
          onPress={() => this.removePicture()}
        />
      </ModalSelector>
    );
  }
}

const connectedComponent = connect<{}, DispatchProps>(
  (state: any) => ({}),
  (dispatch: Dispatch) => bindActionCreators(
    {
      removeValue: actions.removeValue,
    },
    dispatch,
  ),
)(withNavigation(RemoveImageButton));

export default connectedComponent;
