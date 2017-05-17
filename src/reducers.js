import * as types from './types';

const error = (state = {}, { type, payload }) => {
  switch(type) {
    case types.LOGIN_SUCCESS:
    case types.LOGOUT:
      return {};
    case types.LOGIN_ERROR:
      return payload;
    default:
      return state;
  }
}

const auth = (state = {}, { type, payload }) => {
  switch(type) {
    case types.LOGIN_SUCCESS:
      const { token, decoded } = payload;
      return { token, decoded };
    case types.LOGOUT:
    case types.LOGIN_ERROR:
      return {
        error: error(state.error, { type, payload })
      };
    default:
      return state;
  }
}

export default auth;

export const getToken = state => state.token;
export const getDecoded = state => state.decoded;
export const getError = state => state.error;