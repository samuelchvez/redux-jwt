import jwt_decode from 'jwt-decode';
import isPromise from 'is-promise';

import { call, put, takeEvery } from 'redux-saga/effects'

import * as actions from './actions';
import * as types from './types';


export const genLoginSaga = (apiLogin, getToken, getDecoded) => {
  const login = function* (action) {
    const { payload } = action;
    const { username, password, ...extra } = payload;
    try {
      const result = yield call(
        apiLogin,
        username,
        password,
        extra,
      );

      const token = getToken(result);
      const decoded = getDecoded(jwt_decode, result, payload);

      yield put(
        actions.completeLogin(
          token,
          decoded,
          payload
        )
      );
    } catch (error) {

      yield put(actions.failLogin({
        ...error,
        retryAction: action
      }));
    }
  }

  const watchLogin = function* () {
    yield takeEvery(types.LOGIN_STARTED, login);
  }

  return watchLogin;
}
