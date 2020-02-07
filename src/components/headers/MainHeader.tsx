import React from 'react';
import {
  StyleSheet, Image, View, Text, ActivityIndicator,
} from 'react-native';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  Menu, MenuOptions, MenuOption, MenuTrigger,
} from 'react-native-popup-menu';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import routeNames from 'constants/routeNames';
import InspectionType from 'types/inspectionType';
import WorkOrderType from 'types/workOrderType';
import images from 'resources/images';
import icons from 'resources/icons';
import dimensions from 'styles/dimensions';
import { actions } from 'ducks/auth';
import { actions as workOrdersActions } from 'ducks/workOrders';
import { ButtonPrimary } from 'components/elements/buttons';
import { withToaster, WithToasterProps } from 'components/Toaster';
import { Label, font } from 'components/elements/typography';
import SettingsModal from 'components/screens/SettingsModal';
import colors from 'styles/colors';

enum DropDownOptions {
  AccountSettings = 'AccountSettings',
  Logout = 'Logout',
}

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
    marginHorizontal: dimensions.spacing * 2,
    alignItems: 'center',
  },
  buttonPrimary: {
    paddingHorizontal: dimensions.inputPadding,
  },
  iconLabel: {
    ...font.regular,
    fontSize: 11,
    color: colors.blueDark,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: colors.blueDark,
  },
  menuItemButton: {
    padding: dimensions.spacing,
  },
  spinner: {
    marginLeft: 'auto',
  },
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#FAFCFE',
    padding: 0,
  },
  optionWrapper: {
    backgroundColor: colors.white,
    marginBottom: 3,
  },
};


interface StoreProps {
  createInspection: typeof workOrdersActions.create;
}

interface DispatchProps {
  logout: () => void;
  dispatch: Dispatch;
}

type Props = StoreProps & DispatchProps & NavigationInjectedProps & WithToasterProps;

interface State {
  showSettings: boolean;
  loading: boolean;
}

class MainHeader extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      showSettings: false,
      loading: false,
    };
  }

  private onCreateInspection = (): void => {
    const {
      createInspection, dispatch, navigation: { navigate }, addToast,
    } = this.props;
    const inspectionType = InspectionType.SINGLE_FAMILY;
    this.setState({ loading: true });

    requestAnimationFrame(() => {
      const inspection = createInspection(WorkOrderType.INSPECTION, inspectionType);
      dispatch(inspection);
      addToast(`New inspection created with ID: ${inspection.payload.internalId}`);
      this.setState({ loading: false });
      navigate(routeNames.INSPECTION, { inspectionType, newlyCreated: true });
    });
  }

  private openSettings = () => this.setState({ showSettings: true })

  private closeSettings = () => this.setState({ showSettings: false })

  private onModalSelect = (option: DropDownOptions) => {
    switch (option) {
      case DropDownOptions.AccountSettings:
        this.openSettings();
        break;
      case DropDownOptions.Logout:
        this.props.logout();
        break;
      default: console.error(`Undefined dropdown option ${option} in MainHeader`);
    }
  }

  public render(): JSX.Element {
    const { showSettings, loading } = this.state;
    return (
      <View style={styles.base}>
        <Image source={images.logo} />
        <View style={styles.controls}>
          <ButtonPrimary
            style={styles.buttonPrimary}
            title="New inspection"
            icon={icons.plusWhite}
            onPress={this.onCreateInspection}
          >
            {loading && <ActivityIndicator size="small" color={colors.white} style={styles.spinner} />}
          </ButtonPrimary>
          <Menu onSelect={this.onModalSelect} rendererProps={{ styles: { marginTop: 30 } }}>
            <MenuTrigger>
              <View style={styles.button}>
                <Icon name="settings" size={24} color={colors.blueDark} />
                <Text style={styles.iconLabel}>Settings</Text>
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>
              <MenuOption value={DropDownOptions.AccountSettings}>
                <View style={styles.menuItem}>
                  <Icon name="account" size={24} color={colors.blueDark} style={styles.menuItemButton} />
                  <Label style={styles.menuItemText}>Account settings</Label>
                </View>
              </MenuOption>
              <MenuOption value={DropDownOptions.Logout} style={{ marginBottom: 0 }}>
                <View style={styles.menuItem}>
                  <Icon name="logout" size={24} color={colors.blueDark} style={styles.menuItemButton} />
                  <Label style={styles.menuItemText}>Logout</Label>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
          <SettingsModal isOpen={showSettings} closeAction={this.closeSettings} />
        </View>
      </View>
    );
  }
}

export default connect<{}, DispatchProps>(
  () => ({
    createInspection: workOrdersActions.create,
  }),
  (dispatch: Dispatch) => ({
    logout: actions.logout,
    dispatch,
  }),
)(withNavigation(withToaster(MainHeader)));
