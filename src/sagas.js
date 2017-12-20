import jwt_decode from 'jwt-decode';
import isPromise from 'is-promise';

import { actions as jwtActions, types as jwtTypes } from 'nozzmo-redux-jwt';

import { call, put, takeEvery } from 'redux-saga/effects'


export const genLoginSaga = (apiLogin, getToken, getDecoded) => {
  const login = function* ({ payload }) {
     try {
        const result = yield call(
          apiLogin,
          payload.username,
          payload.password
        );

        const token = getToken(result);
        const decoded = getDecoded(jwt_decode, result, payload);

        yield put(
          jwtActions.completeLogin(
            token,
            decoded,
            payload
          )
        );
     } catch (error) {
        const { message, promise } = error;

        if(isPromise(promise)) {
          const extra = yield promise;
          yield put(
            jwtActions.failLogin(
              message,
              extra
            )
          );
        } else {
          yield put(
            jwtActions.failLogin(
              message,
              error
            )
          );
        }
     }
  }

  const watchLogin = function* () {
    yield takeEvery(jwtTypes.LOGIN_STARTED, login);
  }

  return watchLogin;
}
