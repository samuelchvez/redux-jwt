import jwt_decode from 'jwt-decode';
import isPromise from 'is-promise';

import * as types from './types';

export const logout = () => ({
  type: types.LOGOUT,
  payload: {}
});

export const loginStart = username => ({
  type: types.LOGIN_START,
  payload: { username }
});

export const loginSuccess = (token, decoded) => ({
  type: types.LOGIN_SUCCESS,
  payload: { token, decoded }
});

export const loginError = (message, extra) => ({
  type: types.LOGIN_ERROR,
  payload: { message, extra }
});

export const login = apiLogin =>
  (username, password) =>
    dispatch => {
      dispatch(loginStart(username));

      return apiLogin(username, password).then(
        token => {
          const decoded = jwt_decode(token)
          dispatch(loginSuccess(token, decoded));
          return { token, decoded }
        }
      ).catch( e => {
        const { message, promise, ...rest } = e;

        if(isPromise(promise))
          return promise.then(extra =>
            dispatch(
              loginError(message, extra)))

        return dispatch(loginError(message, e));
      })
  }