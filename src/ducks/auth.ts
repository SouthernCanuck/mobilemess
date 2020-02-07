/* eslint-disable @typescript-eslint/explicit-function-return-type,func-names */
import { Reducer, AnyAction as Action } from 'redux';
import {
  all, takeLeading, call, put, select,
} from 'redux-saga/effects';
import { TokenResponse } from 'expo-app-auth';

import * as AuthEffects from 'effects/auth';

export const NAME = 'AUTH';

// Initial State
export interface State {
  readonly idToken?: string;
  readonly accessToken?: string;
  readonly accessTokenExpirationTime?: number;
  readonly refreshToken?: string;
  readonly isLoggingIn: boolean;
  // readonly tokenResponse?: TokenResponse;
}
export const initialState: State = {
  isLoggingIn: false,
};

// Action Types
const LOGIN = `${NAME}/LOGIN`;
const LOGGING_IN = `${NAME}/LOGGING_IN`;
export const LOGGED_IN = `${NAME}/LOGGED_IN`;
const LOGOUT = `${NAME}/LOGOUT`;
const LOGGED_OUT = `${NAME}/LOGGED_OUT`;

// Action Creators
export const actions = {
  login: (): Action => ({ type: LOGIN }),
  loggingIn: (): Action => ({ type: LOGGING_IN }),
  loggedIn: (payload: TokenResponse): Action => ({
    type: LOGGED_IN,
    payload,
  }),
  logout: (): Action => ({ type: LOGOUT }),
  loggedOut: (): Action => ({ type: LOGGED_OUT }),
};

// Selectors
const getAuth = (state: { [NAME]: State }): State => state[NAME];
const getIdToken = (state: { [NAME]: State }): string | undefined => getAuth(state).idToken;
const getAccessToken = (state: { [NAME]: State }): string | undefined => getAuth(state).accessToken;
const getAccessTokenExpirationTime = (
  state: { [NAME]: State },
): number | undefined => getAuth(state).accessTokenExpirationTime;
const getRefreshToken = (state: { [NAME]: State }): string | undefined => getAuth(state).refreshToken;
const isLoggingIn = (state: { [NAME]: State }): boolean => getAuth(state).isLoggingIn;
// const getTokenResponse = (state: { [NAME]: State }): TokenResponse | undefined => getAuth(state).tokenResponse;

export const selectors = {
  getIdToken,
  getAccessToken,
  getAccessTokenExpirationTime,
  getRefreshToken,
  isLoggingIn,
  // getTokenResponse,
};

// Reducers
export const reducer = (
  (state: State = initialState, action: Action) => {
    switch (action.type) {
      case LOGGING_IN: return {
        ...state,
        isLoggingIn: true,
      };
      case LOGGED_IN: {
        const {
          idToken, accessToken, accessTokenExpirationDate, refreshToken,
        } = action.payload as TokenResponse;
        return {
          ...state,
          idToken,
          accessToken,
          accessTokenExpirationTime: new Date(accessTokenExpirationDate!).getTime(),
          refreshToken,
          isLoggingIn: false,
          // tokenResponse: action.payload as TokenResponse,
        };
      }
      case LOGGED_OUT:
        return initialState;
      default:
        return state;
    }
  }
) as Reducer<State, Action>;

// Sagas
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const createSagas = () => {
  function* doLogin() {
    const [
      loggingIn, refreshToken,
    ] = yield Promise.all([
      yield select(selectors.isLoggingIn),
      yield select(selectors.getRefreshToken),
    ]);
    if (!loggingIn) {
      yield put(actions.loggingIn());
      const tokenResponse = (refreshToken)
        ? yield call(AuthEffects.refresh, refreshToken)
        : yield call(AuthEffects.login);
      yield put(actions.loggedIn(tokenResponse));
    }
  }

  function* doLogout() {
    yield call(AuthEffects.logout);
    yield put(actions.loggedOut());
  }

  return function* saga() {
    yield all([
      takeLeading(LOGIN, doLogin),
      takeLeading(LOGOUT, doLogout),
    ]);
  };
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
