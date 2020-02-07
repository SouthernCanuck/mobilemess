/* eslint-disable @typescript-eslint/explicit-function-return-type,func-names */
import { Reducer, AnyAction as Action } from 'redux';
import {
  all, takeEvery, select, put,
} from 'redux-saga/effects';

import {
  ToSketchMessage, FromSketchMessage, FromSketchMessageType, ToSketchMessageType,
} from 'types/sketch';
import { ReadData } from 'helpers/persistency/local/types';
import load from 'helpers/persistency/local/loader';
import { actions as persistentStoreActions } from 'ducks/persistentStore';

export type PostToSketch = (message: ToSketchMessage) => void

export interface State {
  postToSketch?: PostToSketch;
}

// Initial State
export const initialState: State = {
  postToSketch: undefined,
};

export const NAME = 'SKETCH';

// Action Types
const SET_POST_TO_SKETCH = `${NAME}/SET_POST_TO_SKETCH`;
const FROM_SKETCH_MESSAGE = `${NAME}/FROM_SKETCH_MESSAGE`;
const TO_SKETCH_MESSAGE = `${NAME}/TO_SKETCH_MESSAGE`;
const SET_SKETCH_DATA = `${NAME}/SET_SKETCH_DATA`;
export const SKETCH_DATA = `${NAME}/SKETCH_DATA`;

// Action Creators
export const actions = {
  setPostToSketch: (postToSketch?: PostToSketch): Action => ({
    type: SET_POST_TO_SKETCH,
    payload: postToSketch,
  }),
  fromSketchMessage: (message: FromSketchMessage): Action => ({
    type: FROM_SKETCH_MESSAGE,
    payload: message,
  }),
  toSketchMessage: (message: ToSketchMessage): Action => ({
    type: TO_SKETCH_MESSAGE,
    payload: message,
  }),
  setSketchData: (sketchId: string): Action => ({
    type: SET_SKETCH_DATA,
    payload: sketchId,
  }),
};

// Selectors
const getSketch = (state: { [NAME]: State }): State => state[NAME];
const getPostToSketch = (state: { [NAME]: State }) => getSketch(state).postToSketch;

export const reducer = (
  (state: State = initialState, action: Action): State => {
    switch (action.type) {
      case SET_POST_TO_SKETCH:
        return { ...state, postToSketch: action.payload };
      default:
        return state;
    }
  }
) as Reducer<State, Action>;

const unreachableCaseSwallow = (arg: never): never => arg;

// Sagas
export const createSagas = () => {
  function* fromSketchMessage({ payload }: Action & { payload: FromSketchMessage }) {
    switch (payload.type) {
      case FromSketchMessageType.Ping: {
        yield put(actions.toSketchMessage({ type: ToSketchMessageType.Pong }));
        return;
      }
      case FromSketchMessageType.SaveSketchData: {
        yield put(persistentStoreActions.saveSketchData(payload.sketchId, payload.modelJson));
        return;
      }
      case FromSketchMessageType.Log: {
        console[payload.level](`WebView: ${payload.message}`);
        return;
      }
      default: unreachableCaseSwallow(payload);
    }
  }

  function* toSketchMessage({ payload }: Action & { payload: ToSketchMessage }) {
    const postToSketch = getPostToSketch(yield select());
    if (postToSketch) {
      postToSketch(payload);
    } else {
      console.error('Can\'t communicate with sketch');
    }
  }

  function* setSketchData({ payload }: Action & { payload: string }) {
    try {
      const data: ReadData = yield load();
      if (data) {
        const order = data.orders.find((o) => o.order.internalId === payload);
        if (order && order.sketch) {
          yield put(actions.toSketchMessage({ type: ToSketchMessageType.SetSketchData, modelJson: order.sketch }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return function* saga() {
    yield all([
      takeEvery(FROM_SKETCH_MESSAGE, fromSketchMessage),
      takeEvery(TO_SKETCH_MESSAGE, toSketchMessage),
      takeEvery(SET_SKETCH_DATA, setSketchData),
    ]);
  };
};
