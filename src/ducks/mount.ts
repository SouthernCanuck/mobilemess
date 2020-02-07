/* eslint-disable @typescript-eslint/explicit-function-return-type,func-names */
import { AnyAction as Action } from 'redux';
import {
  all, put, takeLeading,
} from 'redux-saga/effects';

import { apiConfig } from 'config/apiConfig';
import { LOGGED_IN } from 'ducks/auth';
import { actions as persistentStoreActions } from 'ducks/persistentStore';

export const NAME = 'MOUNT';

// Action Types
export const MOUNTED = `${NAME}/MOUNTED`;

// Action Creators
export const actions = {
  mounted: (): Action => ({
    type: MOUNTED,
  }),
};


// Sagas
export const createSagas = () => {
  function* doMount() {
    if (apiConfig.enabled) {
      yield put(persistentStoreActions.loadDB());
    }
    yield put(actions.mounted());
  }

  return function* saga() {
    yield all([
      takeLeading(LOGGED_IN, doMount),
    ]);
    if (!apiConfig.enabled) {
      yield put(persistentStoreActions.loadDB());
    }
  };
};
