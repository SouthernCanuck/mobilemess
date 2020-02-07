import { Reducer, AnyAction as Action } from 'redux';
import {
  all, call, takeEvery, select, put,
} from 'redux-saga/effects';
import uuid from 'uuid/v4';

import { apiConfig } from 'config/apiConfig';
import { selectors as authSelectors } from 'ducks/auth';
import { actions as inspectionActions } from 'ducks/inspection';
import * as ApiEffects from 'effects/api';
import InspectionType from 'types/inspectionType';
import { PayloadAction } from 'types/payloadAction';
import WorkOrder from 'types/workOrder';
import WorkOrderStatus from 'types/workOrderStatus';
import WorkOrderType from 'types/workOrderType';
import { NOT_SAVED } from 'helpers/persistency/remote';
import { FieldValueMap } from 'types/fieldValue';
import { getOrderFields } from 'helpers/orderFields';
import { ToasterActions, ToastLevels } from 'components/Toaster';

export const NAME = 'ORDERS';
const WORK_ORDERS = 'workOrders';
const SELECTED_ORDER_ID = 'selectedOrder';

export interface State {
  [WORK_ORDERS]: WorkOrder[];
  [SELECTED_ORDER_ID]?: string;
}

// Initial State
export const initialState: State = {
  [WORK_ORDERS]: [],
  [SELECTED_ORDER_ID]: undefined,
};

// Action Types
export const CREATE = `${NAME}/CREATE`;
export const REMOVE = `${NAME}/REMOVE`;
export const UPDATE = `${NAME}/UPDATE`;
export const ACCEPT = `${NAME}/ACCEPT`;
export const DECLINE = `${NAME}/DECLINE`;
const SELECT_ORDER = `${NAME}/SELECT_ORDER`;
const CLOSE_ORDER_DETAIL = `${NAME}/CLOSE_ORDER_DETAIL`;
export const APPLY_ORDERS = `${NAME}/APPLY_ORDERS`;
const LOAD_INSPECTION = `${NAME}/LOAD_INSPECTION`;
export const SAVE_INSPECTION = `${NAME}/SAVE_INSPECTION`;
const INSPECTION_SAVED = `${NAME}/INSPECTION_SAVED`;
const ADD_INSPECTION = `${NAME}/ADD_INSPECTION`;

interface CreateOrderPayload {
  workOrderType: WorkOrderType;
  inspectionType: InspectionType;
  internalId: string;
}

interface UpdateInspectionPayload {
  internalId: string;
  changedInspectionData: any;
}

interface SaveInspectionPayload {
  internalId: string;
  inspectionData: any;
}

interface InspectionSavedPayload {
  internalId: string;
  lastRemoteSave: number;
  inspectionId?: string;
}

interface InspectionAddPayload {
  internalId: string;
  order: Omit<WorkOrder, 'internalId'>;
}

// Action Creators
export const actions = {
  create: (workOrderType: WorkOrderType, inspectionType: InspectionType): Action & { payload: CreateOrderPayload } => ({
    type: CREATE,
    payload: {
      workOrderType,
      inspectionType,
      internalId: uuid(),
    },
  }),
  remove: (internalId: string): Action => ({
    type: REMOVE,
    payload: internalId,
  }),
  accept: (internalId: string): Action => ({
    type: ACCEPT,
    payload: internalId,
  }),
  decline: (internalId: string): Action => ({
    type: DECLINE,
    payload: internalId,
  }),
  update: (internalId: string, changedInspectionData: Partial<WorkOrder>): Action => ({
    type: UPDATE,
    payload: { internalId, changedInspectionData },
  }),
  selectOrder: (internalId: string): Action => ({
    type: SELECT_ORDER,
    payload: internalId,
  }),
  closeOrderDetail: (): Action => ({
    type: CLOSE_ORDER_DETAIL,
  }),
  applyOrders: (orders: WorkOrder[]): Action => ({
    type: APPLY_ORDERS,
    payload: orders,
  }),
  loadInspection: (internalId: string): Action => ({
    type: LOAD_INSPECTION,
    payload: internalId,
  }),
  saveInspection: (internalId: string, inspectionData: any): Action & { payload: SaveInspectionPayload } => ({
    type: SAVE_INSPECTION,
    payload: {
      internalId,
      inspectionData,
    },
  }),
  inspectionSaved: (
    internalId: string,
    lastRemoteSave: number,
    inspectionId?: string,
  ): Action & { payload: InspectionSavedPayload } => ({
    type: INSPECTION_SAVED,
    payload: {
      internalId,
      lastRemoteSave,
      inspectionId,
    },
  }),
  addInspection: (order: Omit<WorkOrder, 'internalId'>): Action & { payload: WorkOrder } => ({
    type: ADD_INSPECTION,
    payload: {
      ...order,
      internalId: uuid(),
    },
  }),
};

// Selectors
const getWorkOrders = (state: { [NAME]: State }): State => state[NAME];

const getAllOrders = (state: { [NAME]: State }): WorkOrder[] => getWorkOrders(state)[WORK_ORDERS];

const getWorkOrderById = (
  state: { [NAME]: State }, internalId: string,
): WorkOrder | undefined => getAllOrders(state).find((order: WorkOrder) => order.internalId === internalId);

const getNewOrders = (state: { [NAME]: State }): WorkOrder[] => getAllOrders(state)
  .filter((order: WorkOrder) => order.status === WorkOrderStatus.AVAILABLE);

const getInProgressOrders = (state: { [NAME]: State }): WorkOrder[] => getAllOrders(state)
  .filter((order: WorkOrder) => (
    order.status === WorkOrderStatus.IN_PROGRESS
    || order.status === WorkOrderStatus.REVISION
    || order.status === WorkOrderStatus.SCHEDULED
    || order.status === WorkOrderStatus.UNSCHEDULED
  ));

const getSentOrders = (state: { [NAME]: State }): WorkOrder[] => getAllOrders(state)
  .filter((order: WorkOrder) => (
    order.status === WorkOrderStatus.EXPIRED
    || order.status === WorkOrderStatus.SUBMITTED
  ));

const getSelectedOrderId = (state: { [NAME]: State }): string | undefined => getWorkOrders(state)[SELECTED_ORDER_ID];

const getSelectedOrder = (state: { [NAME]: State }): WorkOrder | undefined => getWorkOrderById(
  state,
  getSelectedOrderId(state)!,
);

export const selectors = {
  getAllOrders,
  getWorkOrderById,
  getNewOrders,
  getInProgressOrders,
  getSentOrders,
  getSelectedOrderId,
  getSelectedOrder,
};

// Reducers
const createWorkOrderReducer = (state: State,
  { workOrderType, inspectionType, internalId }: CreateOrderPayload): State => ({
  ...state,
  [WORK_ORDERS]: state[WORK_ORDERS].concat({
    internalId,
    workOrderType,
    inspectionType,
    status: WorkOrderStatus.IN_PROGRESS,
    address: '',
    appointment: new Date(),
    dueDate: new Date(),
    expiration: new Date(),
    summary: '',
    client: '',
    phoneNumber: '',
    inspectionData: {},
    lastRemoteSave: NOT_SAVED,
    lastLocalChange: Date.now(),
  }),
});

const removeWorkOrderReducer = (state: State, internalId: string): State => ({
  ...state,
  [WORK_ORDERS]: state[WORK_ORDERS].filter((order: WorkOrder) => order.internalId !== internalId),
});

const updateWorkOrderReducer = (
  state: State,
  { internalId, changedInspectionData }: UpdateInspectionPayload,
): State => (
  {
    ...state,
    [WORK_ORDERS]: state[WORK_ORDERS].map((workOrder: WorkOrder) => {
      if (workOrder.internalId !== internalId) {
        return workOrder;
      }
      return { ...workOrder, ...changedInspectionData };
    }),
  }
);

const saveInspectionReducer = (state: State, { internalId, inspectionData }: SaveInspectionPayload): State => ({
  ...state,
  [WORK_ORDERS]: state[WORK_ORDERS].map((order: WorkOrder) => {
    if (order.internalId !== internalId) {
      return order;
    }

    const orderFields = getOrderFields(inspectionData);
    if (!orderFields.contactPhone
        || !orderFields.contactName) {
      return order;
    }

    // eslint-disable-next-line max-len
    const address = `${orderFields.generalAddress}, ${orderFields.generalAddressCity}, ${orderFields.generalAddressState} ${orderFields.generalAddressZip}`;
    const client = orderFields.contactName;
    const phoneNumber = orderFields.contactPhone;
    return {
      ...order,
      address,
      phoneNumber,
      client,
      inspectionData,
      lastRemoteSave: order.lastRemoteSave, // prevent overriding by accident
      lastLocalChange: Date.now(),
    };
  }),
});

const inspectionSavedReducer = (
  state: State,
  { internalId, lastRemoteSave, inspectionId }: InspectionSavedPayload,
): State => ({
  ...state,
  [WORK_ORDERS]: state[WORK_ORDERS].map((order: WorkOrder) => order.internalId === internalId
    ? {
      ...order,
      lastRemoteSave,
      inspectionId: inspectionId ?? order.inspectionId,
    }
    : order),
});

export const reducer = (
  (state: State = initialState, action: Action): State => {
    switch (action.type) {
      case CREATE:
        return createWorkOrderReducer(state, action.payload);
      case REMOVE:
        return removeWorkOrderReducer(state, action.payload);
      case UPDATE:
        return updateWorkOrderReducer(state, action.payload);
      case SELECT_ORDER:
        return { ...state, [SELECTED_ORDER_ID]: action.payload };
      case CLOSE_ORDER_DETAIL:
        return { ...state, [SELECTED_ORDER_ID]: undefined };
      case APPLY_ORDERS:
        return { ...state, [WORK_ORDERS]: action.payload, [SELECTED_ORDER_ID]: undefined };
      case SAVE_INSPECTION:
        return saveInspectionReducer(state, action.payload);
      case INSPECTION_SAVED:
        return inspectionSavedReducer(state, action.payload);
      case ADD_INSPECTION:
        return { ...state, [WORK_ORDERS]: [...state[WORK_ORDERS], action.payload] };
      default:
        return state;
    }
  }
) as Reducer<State, Action>;

// Sagas
export const createSagas = () => {
  function* doLoadInspection({ payload }: PayloadAction) {
    const internalId = payload as string;
    const workOrder: WorkOrder = yield select(selectors.getWorkOrderById, internalId);
    const inspectionData = workOrder.inspectionData || {};

    yield put(inspectionActions.applyChanges(inspectionData as FieldValueMap));
  }

  function* doSaveInspection({ payload }: PayloadAction) {
    const { inspectionData } = payload as SaveInspectionPayload;

    const orderFields = getOrderFields(inspectionData);
    if (orderFields.contactPhone
      && orderFields.contactName) {
      return;
    }

    yield ToasterActions.addToast('Cannot save, order info is empty', ToastLevels.ERROR);
  }

  function* doAcceptInspection({ payload }: PayloadAction) {
    const internalId = payload as string;
    yield put(actions.update(internalId, { status: WorkOrderStatus.UNSCHEDULED }));
    const accessToken = authSelectors.getAccessToken(yield select());
    if (apiConfig.enabled && accessToken) {
      try {
        yield call(
          ApiEffects.changeInspectionStatus,
          accessToken,
          internalId,
          'Assigned',
        );
      } catch (err) {
        // console.error(err);
      }
    }
  }

  function* doDeclineInspection({ payload }: PayloadAction) {
    const internalId = payload as string;
    yield put(actions.remove(internalId));
    const accessToken = authSelectors.getAccessToken(yield select());
    if (apiConfig.enabled && accessToken) {
      try {
        yield call(
          ApiEffects.changeInspectionStatus,
          accessToken,
          internalId,
          'Rejected',
        );
      } catch (err) {
        // console.error(err);
      }
    }
  }

  return function* saga() {
    yield all([
      takeEvery(LOAD_INSPECTION, doLoadInspection),
      takeEvery(SAVE_INSPECTION, doSaveInspection),
      takeEvery(ACCEPT, doAcceptInspection),
      takeEvery(DECLINE, doDeclineInspection),
    ]);
  };
};
