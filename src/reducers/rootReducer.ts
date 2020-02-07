import { combineReducers } from 'redux';

import { NAME as AUTH, reducer as authReducer } from 'ducks/auth';
import { NAME as WORK_ORDERS, reducer as workOrdersReducer } from 'ducks/workOrders';
import { NAME as INSPECTION, reducer as inspectionReducer } from 'ducks/inspection';
import { NAME as NET_INFO, reducer as netInfoReducer } from 'ducks/netInfo';
import { NAME as SKETCH, reducer as sketchReducer } from 'ducks/sketch';

export default () => combineReducers({
  [AUTH]: authReducer,
  // app reducers
  [WORK_ORDERS]: workOrdersReducer,
  [INSPECTION]: inspectionReducer,
  [NET_INFO]: netInfoReducer,
  [SKETCH]: sketchReducer,
});
