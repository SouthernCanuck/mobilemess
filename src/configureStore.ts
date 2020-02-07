import Constants from 'expo-constants';
import {
  applyMiddleware, createStore, compose, Store, AnyAction,
} from 'redux';
import createSagaMiddleware from 'redux-saga';

import initialState, { State as RootState } from 'initialState';
import createRootReducer from 'reducers/rootReducer';
import rootSaga from 'sagas/rootSaga';
import { composeWithDevTools } from 'redux-devtools-extension';

const composer: Function = Constants.manifest.releaseChannel ? compose : composeWithDevTools({});


const sagaMiddleware = createSagaMiddleware();

const configureStore = (): Store<RootState, AnyAction> => {
  const store = createStore(
    createRootReducer(),
    initialState as RootState,
    composer(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
