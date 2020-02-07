import { NAME as AUTH, State as AuthState, initialState as auth } from 'ducks/auth';
import { NAME as WORK_ORDERS, State as WorkOrdersState, initialState as workOrders } from 'ducks/workOrders';
import { NAME as INSPECTION, State as InspectionState, initialState as inspection } from 'ducks/inspection';
import { NAME as NET_INFO, State as NetInfoState, initialState as netInfo } from 'ducks/netInfo';

export interface State {
  [AUTH]: AuthState;
  [WORK_ORDERS]: WorkOrdersState;
  [INSPECTION]: InspectionState;
  [NET_INFO]: NetInfoState;
}

const initialState: State = {
  [AUTH]: auth,
  // initial state values
  [WORK_ORDERS]: workOrders,
  [INSPECTION]: inspection,
  [NET_INFO]: netInfo,
};

export default initialState;
