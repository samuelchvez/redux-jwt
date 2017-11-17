import jwt_decode from 'jwt-decode';
import isPromise from 'is-promise';

import { actions as jwtActions, types as jwtTypes } from 'nozzmo-redux-jwt';

import { call, put, takeEvery } from 'redux-saga/effects'


export const genLoginSaga = (apiLogin) => {
  const login = function* ({ payload }) {
     try {
        const token = yield call(
          apiLogin,
          payload.username,
          payload.password
        );

        yield put(
          jwtActions.completeLogin(
            token,
            jwt_decode(token),
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
