import WorkOrder from 'types/workOrder';

interface OrderData {
  order: WorkOrder;
  sketch?: object;
}

export interface ReadData {
  orders: OrderData[];
}
