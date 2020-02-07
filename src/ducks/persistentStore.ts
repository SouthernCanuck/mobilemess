/* eslint-disable @typescript-eslint/explicit-function-return-type,func-names */
import { AnyAction as Action } from 'redux';
import {
  all, takeEvery, select, put, call, fork, delay, take, race,
} from 'redux-saga/effects';

import { apiConfig } from 'config/apiConfig';
import load from 'helpers/persistency/local/loader';
import save from 'helpers/persistency/local/serializer';
import { formatInspectionForAPI, NOT_SAVED, readInspectionFromAPI } from 'helpers/persistency/remote';
import {
  CREATE as CREATE_WORK_ORDER,
  REMOVE as REMOVE_WORK_ORDER,
  APPLY_ORDERS,
  SAVE_INSPECTION,
  selectors as workOrdersSelectors,
  actions as workOrdersActions,
} from 'ducks/workOrders';
import { selectors as authSelectors } from 'ducks/auth';
import { actions as sketchActions, SKETCH_DATA } from 'ducks/sketch';
import { ToasterActions, ToastLevels } from 'components/Toaster';
import * as ApiEffects from 'effects/api';
import { ApiListInspection, ApiInspection, InspectionPayload } from 'types/api/types';
import WorkOrderType from 'types/workOrderType';
import InspectionType from 'types/inspectionType';
import WorkOrderStatus from 'types/workOrderStatus';
import { ToSketchMessageType } from 'types/sketch';
import { ReadData } from 'helpers/persistency/local/types';
import { SET_OFFLINE_MODE, selectors as netInfoSelectors } from './netInfo';

const testData: ReadData = {
  orders: [
    {
      order: {
        inspectionId: '0',
        internalId: '0',
        workOrderType: WorkOrderType.INSPECTION,
        inspectionType: InspectionType.SINGLE_FAMILY,
        status: WorkOrderStatus.IN_PROGRESS,
        client: 'First American',
        address: '890-908 8th Ave, New York, NY 10019, USA',
        appointment: new Date('August 27, 2019 15:45:00 UTC+2'),
        dueDate: new Date('August 28, 2019'),
        summary: 'This is a summary of the first order',
        phoneNumber: '(555) 123 456 89',
        inspectionData: {},
        lastRemoteSave: NOT_SAVED,
        lastLocalChange: 0,
      },
    },
    {
      order: {
        inspectionId: '1',
        internalId: '1',
        workOrderType: WorkOrderType.INSPECTION,
        inspectionType: InspectionType.SINGLE_FAMILY,
        status: WorkOrderStatus.IN_PROGRESS,
        address: '1399-1201 Ireland St, Nashville, KY 11681, USA',
        client: 'First American',
        appointment: new Date('August 30, 2019 07:45:00 UTC+2'),
        dueDate: new Date('August 28, 2019'),
        summary: 'This is a summary of an order that is in progress',
        phoneNumber: '(555) 123 456 89',
        inspectionData: {},
        lastRemoteSave: NOT_SAVED,
        lastLocalChange: 0,
      },
    },
    {
      order: {
        inspectionId: '3',
        internalId: '3',
        workOrderType: WorkOrderType.INSPECTION,
        inspectionType: InspectionType.SINGLE_FAMILY,
        status: WorkOrderStatus.REVISION,
        address: '890-908 8th Ave, New York, NY 10019, USA',
        client: 'First American',
        appointment: new Date('August 27, 2019 15:45:00 UTC+2'),
        dueDate: new Date('August 28, 2019'),
        summary: 'This is a summary of the order that needs revision',
        phoneNumber: '(555) 123 456 89',
        inspectionData: {},
        lastRemoteSave: NOT_SAVED,
        lastLocalChange: 0,
      },
    },
    {
      order: {
        inspectionId: '4',
        internalId: '4',
        workOrderType: WorkOrderType.INSPECTION,
        inspectionType: InspectionType.SINGLE_FAMILY,
        status: WorkOrderStatus.UNSCHEDULED,
        address: '2700-2776 22nd St, Sacramento, CA 95818',
        client: 'First American',
        appointment: new Date('August 20, 2019 15:45:00 UTC+2'),
        dueDate: new Date('August 28, 2019'),
        summary: 'This order is not scheduled',
        phoneNumber: '(555) 123 456 89',
        inspectionData: {},
        lastRemoteSave: NOT_SAVED,
        lastLocalChange: 0,
      },
    },
    {
      order: {
        inspectionId: '5',
        internalId: '5',
        workOrderType: WorkOrderType.INSPECTION,
        inspectionType: InspectionType.SINGLE_FAMILY,
        status: WorkOrderStatus.AVAILABLE,
        address: '1800-1898 11th Ave, Seattle, WA 98122',
        client: 'First American',
        appointment: new Date('August 26, 2019 15:45:00 UTC+2'),
        dueDate: new Date('August 28, 2019'),
        expiration: new Date('August 26, 2019 17:45:00 UTC+2'),
        summary: 'The only order that is actually available',
        phoneNumber: '(555) 123 456 89',
        inspectionData: {},
        lastRemoteSave: NOT_SAVED,
        lastLocalChange: 0,
      },
    },
    {
      order: {
        inspectionId: '6',
        internalId: '6',
        workOrderType: WorkOrderType.INSPECTION,
        inspectionType: InspectionType.SINGLE_FAMILY,
        status: WorkOrderStatus.SCHEDULED,
        address: '2700-2776 22nd St, Sacramento, CA 95818',
        client: 'First American',
        appointment: new Date('August 20, 2019 15:45:00 UTC+2'),
        dueDate: new Date('August 28, 2019'),
        summary: 'A scheduled inspection',
        phoneNumber: '(555) 123 456 89',
        inspectionData: {},
        lastRemoteSave: NOT_SAVED,
        lastLocalChange: 0,
      },
    },
  ],
};

export const NAME = 'PERSISTENT_STORE';

// Action Types
const SAVE_DB = `${NAME}/SAVE_DB`;
const LOAD_DB = `${NAME}/LOAD_DB`;
const SAVE_SKETCH_DATA = `${NAME}/SAVE_SKETCH_DATA`;


interface SaveSketchDataPayload {
  sketchId: string;
  sketch: object;
}

// Action Creators
export const actions = {
  saveDB: (): Action => ({
    type: SAVE_DB,
  }),
  loadDB: (): Action => ({
    type: LOAD_DB,
  }),
  saveSketchData: (sketchId: string, sketch: object): Action & { payload: SaveSketchDataPayload } => ({
    type: SAVE_SKETCH_DATA,
    payload: {
      sketchId,
      sketch,
    },
  }),
};


// Sagas
export const createSagas = () => {
  function* updateChangedOrders() {
    const rootState = yield select();
    const accessToken = authSelectors.getAccessToken(rootState);
    if (accessToken) {
      const now = Date.now();
      const orders = workOrdersSelectors.getAllOrders(rootState);
      yield all(orders.map(function* (order) {
        if (order.lastRemoteSave < order.lastLocalChange && apiConfig.enabled) {
          try {
            if (order.lastRemoteSave === NOT_SAVED || !order.inspectionId) {
              const inspectionId = yield call(ApiEffects.createInspection, accessToken, formatInspectionForAPI(order));
              yield put(workOrdersActions.inspectionSaved(order.internalId, now, inspectionId));
            } else {
              yield call(ApiEffects.updateInspection, accessToken, order.inspectionId, formatInspectionForAPI(order));
              yield put(workOrdersActions.inspectionSaved(order.internalId, now));
            }
          } catch (e) {
            // silently swallow
          }
        }
      }));
    }
  }

  function* doLoadDB() {
    let data: ReadData | undefined;
    try {
      data = yield load();
    } catch (err) {
      console.error(err);
      ToasterActions.addToast(`Cannot load local info: ${err.message}`, ToastLevels.WARN, 10000);
    }

    if (!data) {
      data = apiConfig.enabled ? { orders: [] } : testData;
    }

    yield put(workOrdersActions.applyOrders(data.orders.map((order) => order.order)));

    if (!netInfoSelectors.isOffline(yield select())) {
      yield updateChangedOrders();
    }
  }

  function* doSaveDB() {
    const orders = workOrdersSelectors.getAllOrders(yield select());
    let data: ReadData | undefined;
    try {
      data = yield load();
    } catch (err) {
      console.error(err);
    }
    if (!data) {
      data = { orders: [] };
    }

    data.orders = data.orders.filter(order => !!orders.find(o => o.internalId === order.order.internalId));
    orders.forEach(order => {
      const dataOrder = data!.orders.find((o) => o.order.internalId === order.internalId);
      if (dataOrder) {
        dataOrder.order = order;
      } else {
        data!.orders.push({ order });
      }
    });

    yield save(data);
    yield updateChangedOrders();
  }

  function* saveSketchData({ payload }: Action & { payload: SaveSketchDataPayload }) {
    try {
      const data: ReadData | undefined = yield load();
      if (data) {
        const { sketchId, sketch } = payload;
        const order = data.orders.find((o) => o.order.internalId === sketchId);
        if (order) {
          order.sketch = sketch;
          yield save(data);
          yield updateChangedOrders();
        } else {
          console.error(`Order ${sketchId} not found`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  function* onOfflineModeChange({ payload: isOffline }: Action & { payload: boolean }) {
    if (!isOffline) {
      yield updateChangedOrders();
    }
  }

  function* pollServerForNewInspections() {
    while (true) {
      const accessToken = authSelectors.getAccessToken(yield select());
      const assignedToUserEmail = 'jsweeters@firstam.com'; // TODO get from Amplify
      const companyKey = '22'; // TODO get from Amplify
      if (accessToken && assignedToUserEmail && companyKey && apiConfig.enabled) {
        // try {
        //   const createdOne = yield call(
        //     ApiEffects.getInspection,
        //     accessToken,
        //     '7f52fab7-c563-468e-80e0-0f2d188dee42',
        //   );
        //   console.log(createdOne);
        // } catch (err) {
        //   // console.error(err);
        // }
        // try {
        //   const inspection: InspectionPayload = {
        //     assigned_user: assignedToUserEmail,
        //     inspect_json: '',
        //     order_id: '123',
        //     status: '',
        //   }
        //   const newOneId = yield call(
        //     ApiEffects.createInspection,
        //     accessToken,
        //     inspection,
        //   );
        //   console.log(newOneId)
        // } catch (err) {
        //   // console.error(err);
        // }
        try {
          const list: ApiListInspection[] = yield call(
            ApiEffects.listInspections,
            accessToken,
            assignedToUserEmail,
            companyKey,
          );
          const localInspections = workOrdersSelectors.getAllOrders(yield select());
          // TODO: it should be inspection id, but server does not return it
          const localInspectionIds = localInspections.map(i => i.inspectionId);
          yield all(list
            // TODO: it should be inspection id, but server does not return it
            .filter((i) => !localInspectionIds.includes(i.order_id))
            .map(function* (i) {
              try {
                const inspection: ApiInspection = yield call(
                  ApiEffects.getInspection,
                  accessToken,
                  i.order_id, // TODO: it should be inspection id, but server does not return it
                );
                yield put(workOrdersActions.addInspection(readInspectionFromAPI(inspection)));
              } catch (err) {
                // console.error(err);
              }
            }));
        } catch (err) {
          // console.error(err);
        }
      }
      yield delay(60000);
    }
  }

  return function* saga() {
    yield all([
      takeEvery(SAVE_DB, doSaveDB),
      takeEvery(SAVE_INSPECTION, doSaveDB),
      takeEvery(APPLY_ORDERS, doSaveDB),
      takeEvery(CREATE_WORK_ORDER, doSaveDB),
      takeEvery(REMOVE_WORK_ORDER, doSaveDB),
      takeEvery(SAVE_SKETCH_DATA, saveSketchData),
      takeEvery(LOAD_DB, doLoadDB),
      takeEvery(SET_OFFLINE_MODE, onOfflineModeChange),
      fork(pollServerForNewInspections),
    ]);
  };
};
