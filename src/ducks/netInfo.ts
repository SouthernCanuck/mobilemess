/* eslint-disable @typescript-eslint/explicit-function-return-type,func-names */
import { Reducer, AnyAction as Action } from 'redux';
import {
  all, call, put, take,
} from 'redux-saga/effects';
import {
  eventChannel, EventChannel,
} from 'redux-saga';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const NAME = 'NET_INFO';
const IS_OFFLINE = 'isOffline';

export interface State {
  isOffline: boolean;
}

// Initial State
export const initialState: State = {
  [IS_OFFLINE]: true,
};

// Action Types
export const SET_OFFLINE_MODE = `${NAME}/SET_OFFLINE_MODE`;

// Action Creators
export const actions = {
  setOfflineMode: (isOffline: boolean): Action => ({
    type: SET_OFFLINE_MODE,
    payload: isOffline,
  }),
};

// Selectors
const getNetInfo = (state: { [NAME]: State }): State => state[NAME];
const isOffline = (state: { [NAME]: State }) => getNetInfo(state)[IS_OFFLINE];

export const selectors = {
  isOffline,
};

// Reducer
export const reducer = (
  (state: State = initialState, action: Action): State => {
    switch (action.type) {
      case SET_OFFLINE_MODE:
        return {
          ...state,
          [IS_OFFLINE]: action.payload,
        };
      default:
        return state;
    }
  }
) as Reducer<State, Action>;

// Sagas
export const createSagas = () => {
  const channel = (): EventChannel<boolean> => eventChannel((emitter) => {
    NetInfo.fetch().then((state: NetInfoState) => {
      emitter(!state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      emitter(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  });

  function* doStartChannel() {
    const chan = yield call(channel);
    try {
      while (true) {
        // take(END) will cause the saga to terminate by jumping to the finally block
        const isOfflineMode = yield take(chan);
        yield put(actions.setOfflineMode(isOfflineMode));
      }
    } finally {
      yield put(actions.setOfflineMode(true));
    }
  }

  return function* saga() {
    yield all([
      doStartChannel(),
    ]);
  };
};
