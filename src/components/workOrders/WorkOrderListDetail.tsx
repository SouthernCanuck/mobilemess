import React from 'react';
import { connect } from 'react-redux';

import WorkOrder from 'types/workOrder';
import { selectors } from 'ducks/workOrders';
import WorkOrderDetail from './WorkOrderDetail';

interface StateProps {
  selectedOrder?: WorkOrder;
}
type Props = StateProps;

const OrderListDetail = ({ selectedOrder }: Props) => {
  if (!selectedOrder) {
    return null;
  }
  return <WorkOrderDetail order={selectedOrder!} />;
};
export default connect<StateProps, {}>(
  (state: any) => ({
    selectedOrder: selectors.getSelectedOrder(state),
  }),
)(OrderListDetail);
