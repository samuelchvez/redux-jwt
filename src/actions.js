import jwt_decode from 'jwt-decode';
import isPromise from 'is-promise';

import * as types from './types';

export const logout = () => ({
  type: types.LOGOUT,
  payload: {}
});

export const startLogin = (username, password) => ({
  type: types.LOGIN_STARTED,
  payload: { username, password }
});

export const completeLogin = (token, decoded) => ({
  type: types.LOGIN_SUCCEED,
  payload: { token, decoded }
});

export const failLogin = (message, extra) => ({
  type: types.LOGIN_FAILED,
  payload: { message, extra }
});

export const login = apiLogin =>
  (username, password) =>
    dispatch => {
      dispatch(startLogin(username));

      return apiLogin(username, password).then(
        token => {
          const decoded = jwt_decode(token)
          dispatch(completeLogin(token, decoded));
          return { token, decoded }
        }
      ).catch( e => {
        const { message, promise, ...rest } = e;

        if(isPromise(promise))
          return promise.then(extra =>
            dispatch(
              failLogin(message, extra)))

        return dispatch(loginError(message, e));
      })
  }