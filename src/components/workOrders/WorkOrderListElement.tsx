import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';

import WorkOrder from 'types/workOrder';
import WorkOrderStatus from 'types/workOrderStatus';
import { actions } from 'ducks/workOrders';
import { inspectionTypeToString, orderStatusToString } from 'helpers/enumToString';
import { formatDate, formatDateTime, formatExpirationTime } from 'helpers/formatDate';
import { PLATFORM } from 'helpers/platform';
import dimensions from 'styles/dimensions';
import colors, { statusColors } from 'styles/colors';
import { platformSpecific } from 'styles/partials';
import { H2, Status } from 'components/elements/typography';
import WorkOrderProperty from './WorkOrderProperty';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: dimensions.spacing * 2,
    marginTop: dimensions.spacing,
    marginBottom: dimensions.spacing * 1.5,
  },
  orderProperties: {
    flexDirection: 'row',
  },
  item: {
    marginVertical: 5,
    padding: dimensions.spacing * 2,
    backgroundColor: colors.white,
    ...platformSpecific[PLATFORM].boxShadow,
    ...platformSpecific[PLATFORM].workOrderBorder,
  },
});

interface OwnProps {
  order: WorkOrder;
}
interface DispatchProps {
  selectOrder: Function;
}
type Props = OwnProps & DispatchProps;

const WorkOrderListElement = ({ order, selectOrder }: Props) => {
  const {
    status, address, appointment, dueDate, summary, client, inspectionType, expiration, internalId,
  } = order;

  return (
    <View style={styles.container}>
      <Status style={{ marginLeft: 5 }}>
        {status === WorkOrderStatus.AVAILABLE
          ? formatExpirationTime(expiration!)
          : orderStatusToString(status)
        }
      </Status>
      <TouchableOpacity
        style={[styles.item, { borderLeftColor: statusColors[status] }]}
        activeOpacity={0.75}
        onPress={() => selectOrder(internalId)}
      >
        <H2>{address}</H2>
        <View style={styles.orderProperties}>
          {
            status === WorkOrderStatus.REVISION
            && <WorkOrderProperty name="Summary" value={summary!} />
          }
          {
            status === WorkOrderStatus.AVAILABLE
            && <WorkOrderProperty name="Client" value={client!} />
          }
          {
            (
              status === WorkOrderStatus.SCHEDULED
              || status === WorkOrderStatus.IN_PROGRESS
            )
            && <WorkOrderProperty name="Appointment" value={formatDateTime(appointment!)} />
          }
          {
            (
              status === WorkOrderStatus.UNSCHEDULED
              || status === WorkOrderStatus.AVAILABLE
            )
            && <WorkOrderProperty name="Inspection type" value={inspectionTypeToString(inspectionType!)} />
          }
          {
            (
              status === WorkOrderStatus.SCHEDULED
              || status === WorkOrderStatus.UNSCHEDULED
              || status === WorkOrderStatus.AVAILABLE
            )
            && <WorkOrderProperty name="Due date" value={formatDate(dueDate!)} />
          }
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default connect<{}, DispatchProps, OwnProps>(
  () => ({ }),
  (dispatch: any) => bindActionCreators(
    {
      selectOrder: actions.selectOrder,
    },
    dispatch,
  ),
)(WorkOrderListElement);
