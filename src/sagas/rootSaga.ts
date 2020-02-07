import { all, fork } from 'redux-saga/effects';

import { createSagas as authSaga } from 'ducks/auth';
import { createSagas as wordOrdersSaga } from 'ducks/workOrders';
import { createSagas as netInfoSaga } from 'ducks/netInfo';
import { createSagas as persistentStoreSaga } from 'ducks/persistentStore';
import { createSagas as mountSaga } from 'ducks/mount';
import { createSagas as sketchSaga } from 'ducks/sketch';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,func-names
export default function* () {
  yield all([
    fork(authSaga()),
    fork(wordOrdersSaga()),
    fork(netInfoSaga()),
    fork(persistentStoreSaga()),
    fork(mountSaga()),
    fork(sketchSaga()),
  ]);
}
