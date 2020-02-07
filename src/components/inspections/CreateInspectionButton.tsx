import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
  StyleSheet,
} from 'react-native';
import {
  NavigationInjectedProps,
  withNavigation,
} from 'react-navigation';
import PickerSelect from 'react-native-picker-select';

import routeNames from 'constants/routeNames';
import InspectionType from 'types/inspectionType';
import icons from 'resources/icons';
import colors from 'styles/colors';
import { SvgXml } from 'react-native-svg';
import dimensions from 'styles/dimensions';
import { actions as workOrdersActions } from 'ducks/workOrders';
import WorkOrderType from 'types/workOrderType';
import { withToaster, WithToasterProps } from 'components/Toaster';

const inputStyle = {
  height: dimensions.inputHeight,
  paddingLeft: dimensions.inputPadding * 3,
  paddingRight: dimensions.inputPadding * 2,
  paddingVertical: 5,
  borderRadius: dimensions.inputBorderRadius,
  color: colors.white,
  backgroundColor: colors.blue,
  fontWeight: 'bold',
};

const styles = StyleSheet.create({
  inputAndroid: inputStyle,
  inputIOS: inputStyle,
  placeholder: {
    color: colors.white,
  },
  iconContainer: {
    left: dimensions.inputPadding,
    right: 'auto',
    top: 10,
  },
});

const PlusIcon: React.FC = () => <SvgXml width={16} height={16} xml={icons.plusWhite} />;

interface StoreProps {
  createInspection: typeof workOrdersActions.create;
}

interface DispatchProps {
  dispatch: Dispatch;
}

type Props = StoreProps & DispatchProps & NavigationInjectedProps & WithToasterProps

class CreateInspectionButton extends React.Component<Props> {
  private inspectionTypeSelected = (inspectionType: InspectionType): void => {
    const {
      createInspection, dispatch, navigation: { navigate }, addToast,
    } = this.props;
    if (inspectionType) {
      const inspection = createInspection(WorkOrderType.INSPECTION, inspectionType);
      dispatch(inspection);
      addToast(`New inspection created with ID: ${inspection.payload.internalId}`);
      navigate(routeNames.INSPECTION, { inspectionType });
    }
  }

  public render(): JSX.Element | null {
    const { navigation } = this.props;
    const { routeName } = navigation.state;
    return routeName === routeNames.ORDERS_LIST ? (
      <PickerSelect
        useNativeAndroidPickerStyle={false}
        Icon={PlusIcon}
        style={styles}
        onValueChange={this.inspectionTypeSelected}
        items={[
          { label: 'Single family', value: InspectionType.SINGLE_FAMILY },
          { label: 'URAR', value: InspectionType.URAR_INSPECTION },
          { label: 'Custom template', value: InspectionType.CUSTOM },
        ]}
        placeholder={{ label: 'New inspection', value: null }}
      />
    ) : null;
  }
}


export default connect<{}, DispatchProps>(
  () => ({
    createInspection: workOrdersActions.create,
  }),
  (dispatch: Dispatch) => ({
    dispatch,
  }),
)(withNavigation(withToaster(CreateInspectionButton)));
