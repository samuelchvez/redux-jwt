import { combineReducers } from 'redux';
import * as types from './types';

const token = (state = "", { type, payload }) => {
  switch(type) {
    case types.LOGIN_SUCCESS:
      return payload.token;
    case types.LOGOUT:
    case types.LOGIN_ERROR:
      return "";
    default:
      return state;
  }
}

const decoded = (state = {}, { type, payload }) => {
  switch(type) {
    case types.LOGIN_SUCCESS:
      return payload.decoded;
    case types.LOGOUT:
    case types.LOGIN_ERROR:
      return {};
    default:
      return state;
  }
}

const errorMessage = (state = "", { type, payload }) => {
  switch(type) {
    case types.LOGIN_START:
    case types.LOGIN_SUCCESS:
    case types.LOGOUT:
      return "";
    case types.LOGIN_ERROR:
      return payload.message;
    default:
      return state;
  }
}

const errorExtra = (state = {}, { type, payload }) => {
  switch(type) {
    case types.LOGIN_START:
    case types.LOGIN_SUCCESS:
    case types.LOGOUT:
      return {};
    case types.LOGIN_ERROR:
      return payload.extra;
    default:
      return state;
  }
}

const error = combineReducers({
  message: errorMessage,
  extra: errorExtra,
});

const auth = combineReducers({
  token,
  decoded,
  error,
});

export default auth;

export const getToken = state => state.token;
export const getIsAuth = state => getToken(state).length > 0;
export const getDecoded = state => state.decoded;
export const getErrorMessage = state => state.error.message;
export const getErrorExtra = state => state.error.extra;