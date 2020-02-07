import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import { selectors as inspectionSelectors } from 'ducks/inspection';
import { selectors as netInfoSelectors } from 'ducks/netInfo';
import { actions as workOrdersActions } from 'ducks/workOrders';
import icons from 'resources/icons';
import { ButtonIcon } from 'components/elements/buttons';
import dimensions from 'styles/dimensions';

const styles = StyleSheet.create({
  buttonIcon: {
    marginHorizontal: dimensions.spacing / 2,
  },
});

interface OwnProps {
  isOffline: boolean;
  values: object;
}

interface DispatchProps {
  saveInspection: (internalId: string, inspectionData: any) => void;
}

type Props = DispatchProps & OwnProps & NavigationInjectedProps

class SyncButton extends Component<Props> {
  private onSyncButton = (): void => {
    const { saveInspection, navigation, values } = this.props;
    const internalId: string | undefined = navigation.getParam('internalId');
    if (internalId) {
      saveInspection(internalId, values);
    } else {
      console.error('Not on page with inspection');
    }
  }

  public render(): JSX.Element {
    const { isOffline } = this.props;
    if (isOffline) {
      return <></>;
    }

    return (
      <ButtonIcon
        icon={icons.save}
        onPress={this.onSyncButton}
        style={styles.buttonIcon}
      />
    );
  }
}

export default connect<OwnProps, DispatchProps>(
  (state: any) => ({
    isOffline: netInfoSelectors.isOffline(state),
    values: inspectionSelectors.getValues(state),
  }),
  {
    saveInspection: workOrdersActions.saveInspection,
  },
)(withNavigation(SyncButton));
