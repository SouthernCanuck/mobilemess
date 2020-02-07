import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import { actions as workOrdersActions, selectors as workOrdersSelectors } from 'ducks/workOrders';
import icons from 'resources/icons';
import { ButtonIcon } from 'components/elements/buttons';
import dimensions from 'styles/dimensions';
import { ModalSelectorStyles } from 'components/images/ModalStyles';
import ModalSelector from 'react-native-modal-selector';
import routeNames from 'constants/routeNames';
import WorkOrder from 'types/workOrder';
import { withToaster, WithToasterProps, ToastLevels } from 'components/Toaster';

const styles = StyleSheet.create({
  buttonIcon: {
    marginHorizontal: dimensions.spacing * 2,
  },
});

interface OwnProps {
  selectedOrder?: WorkOrder;
}

interface DispatchProps {
  removeInspection: Function;
}

const REMOVE_CONFIRMED = 'Remove Inspection';

interface Method {
  key: string;
  label: string;
}
const METHODS: Method[] = [
  { key: REMOVE_CONFIRMED, label: REMOVE_CONFIRMED },
];

type Props = OwnProps & DispatchProps & NavigationInjectedProps & WithToasterProps;

class RemoveButton extends Component<Props> {
  private onMethodSelect(method: string): void {
    if (method === REMOVE_CONFIRMED) {
      this.onRemoveButton();
    }
  }

  private onRemoveButton = (): void => {
    const { removeInspection, navigation, selectedOrder } = this.props;
    if (selectedOrder) {
      removeInspection(selectedOrder.internalId);
      this.props.addToast(`Order with ID: ${selectedOrder.internalId} was removed`, ToastLevels.INFO);
    }
    navigation.navigate(routeNames.ORDERS_LIST);
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
        <ButtonIcon
          icon={icons.trash}
          onPress={this.onRemoveButton}
          style={styles.buttonIcon}
        />
      </ModalSelector>
    );
  }
}

export default connect<{}, DispatchProps>(
  (state: any) => ({
    selectedOrder: workOrdersSelectors.getSelectedOrder(state),
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      removeInspection: workOrdersActions.remove,
    },
    dispatch,
  ),
)(withNavigation(withToaster(RemoveButton)));
