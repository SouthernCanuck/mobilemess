import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

import WorkOrder from 'types/workOrder';
import WorkOrderStatus from 'types/workOrderStatus';
import { actions } from 'ducks/workOrders';
import { inspectionTypeToString, orderStatusToString } from 'helpers/enumToString';
import { formatDate, formatDateTime, formatExpirationTime } from 'helpers/formatDate';
import routeNames from 'constants/routeNames';
import dimensions from 'styles/dimensions';
import colors from 'styles/colors';
import icons from 'resources/icons';
import {
  H1, Status, Bold, font,
} from 'components/elements/typography';
import { ButtonRound, ButtonPrimary } from 'components/elements/buttons';
import PhoneNumber from 'components/forms/PhoneNumber';
import RemoveButton from 'components/headers/RemoveButton';

const styles = StyleSheet.create({
  container: {
    flexWrap: 'nowrap',
    padding: dimensions.spacing * 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  properties: {
    flexDirection: 'column',
  },
  property: {
    paddingVertical: dimensions.spacing,
    flexDirection: 'row',
  },
  propertyName: {
    width: 200,
  },
  propertyValue: {
    flex: 1,
    ...font.regular,
  },
  propertyPhone: {
    flex: 1,
    color: 'blue',
  },
  buttons: {
    flexDirection: 'row',
    paddingTop: dimensions.spacing,
    justifyContent: 'flex-end',
  },
  buttonStart: {
    marginLeft: dimensions.spacing,
  },
  buttonSketch: {
    marginRight: 'auto',
  },
});

interface OwnProps {
  order: WorkOrder;
}
interface DispatchProps {
  closeOrderDetail: Function;
  loadInspection: Function;
  accept: Function;
  decline: Function;
}
type Props = OwnProps & DispatchProps & NavigationInjectedProps;

class WorkOrderDetail extends Component<Props> {
  private onStartInspection = (): void => {
    const { navigation, order, loadInspection } = this.props;
    const {
      inspectionType,
    } = order;

    loadInspection(order.internalId);
    navigation.navigate(routeNames.INSPECTION, { inspectionType, internalId: order.internalId });
  }

  private onOpenSketch = (): void => {
    const { navigation, order } = this.props;

    navigation.navigate(routeNames.SKETCH, { sketchId: order.internalId });
  }

  private onAccept = (): void => {
    const { accept, order } = this.props;
    accept(order.internalId);
  }

  private onDecline = (): void => {
    const { decline, order, closeOrderDetail } = this.props;
    closeOrderDetail();
    decline(order.internalId);
  }

  public render(): JSX.Element {
    const { order, closeOrderDetail } = this.props;
    const {
      internalId, address, status, inspectionType, appointment, dueDate, expiration, phoneNumber,
    } = order;
    return (
      <View style={styles.container}>
        <Status>
          {status === WorkOrderStatus.AVAILABLE
            ? formatExpirationTime(expiration!)
            : orderStatusToString(status)
          }
        </Status>

        <View style={styles.title}>
          <H1 style={{ flex: 1 }}>{address}</H1>
          <RemoveButton />
          <ButtonRound onPress={() => closeOrderDetail()} icon={icons.close} />
        </View>
        <View style={styles.properties}>
          {[
            ['Inspection type', inspectionType && inspectionTypeToString(inspectionType)],
            ['Appointment', formatDateTime(appointment)],
            ['Due date', formatDate(dueDate)],
          ].map(([name, value]) => (
            <View key={`${internalId}detail${name}`} style={styles.property}>
              <Bold style={styles.propertyName}>{name}</Bold>
              <Text style={styles.propertyValue}>{value}</Text>
            </View>
          ))}
          <View key={`${internalId}detailPhone`} style={styles.property}>
            <Bold style={styles.propertyName}>Phone number</Bold>
            <PhoneNumber style={styles.propertyPhone} phoneNumber={phoneNumber} />
          </View>
        </View>
        <View style={styles.buttons}>
          {(status === WorkOrderStatus.SCHEDULED) && (
            <ButtonPrimary
              title="Open sketch (WIP)"
              style={styles.buttonSketch}
              onPress={this.onOpenSketch}
            />
          )}
          <ButtonPrimary
            title="Start inspection"
            style={styles.buttonStart}
            onPress={this.onStartInspection}
          />
        </View>
        {(status === WorkOrderStatus.AVAILABLE) && (
          <View style={styles.buttons}>
            <ButtonPrimary
              title="Decline"
              style={styles.buttonSketch}
              onPress={this.onDecline}
            />
            <ButtonPrimary
              title="Accept"
              style={styles.buttonStart}
              onPress={this.onAccept}
            />
          </View>
        )}
      </View>
    );
  }
}

export default connect<{}, DispatchProps, OwnProps>(
  () => ({ }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      closeOrderDetail: actions.closeOrderDetail,
      loadInspection: actions.loadInspection,
      accept: actions.accept,
      decline: actions.decline,
    },
    dispatch,
  ),
)(withNavigation(WorkOrderDetail));
