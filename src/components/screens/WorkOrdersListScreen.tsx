import React from 'react';

import WorkOrderList from 'components/workOrders/WorkOrderList';
import WorkOrderListDetail from 'components/workOrders/WorkOrderListDetail';

const WorkOrderListScreen = () => (
  <>
    <WorkOrderList />
    <WorkOrderListDetail />
  </>
);

export default WorkOrderListScreen;
