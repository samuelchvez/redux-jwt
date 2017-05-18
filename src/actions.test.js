import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import deepFreeze from 'deep-freeze';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import jwt_decode from 'jwt-decode';

import * as actions from './actions';
import * as types from './types';


const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

// Mock api
const api = {
  login(username, password) {
    return fetch(
      'http://localhost:8000/jwt-auth/',
      {
        method: 'POST',
        body: { username, password }
      }
    ).then(res => res.json()
    ).then(({ token }) => token)
  }
}

const login = actions.login(api.login);

describe('redux-jwt actions', () => {
  it('should get a logout action.', () =>
    expect(actions.logout()).toEqual({
      type: types.LOGOUT,
      payload: {}
    }));

  it('should get a login start action.', () =>
    expect(actions.loginStart('test')).toEqual({
      type: types.LOGIN_START,
      payload: {
        username: 'test'
      }
    }));

  it('should get a login success action.', () =>
    expect(actions.loginSuccess('123', { a: 1 })).toEqual({
      type: types.LOGIN_SUCCESS,
      payload: {
        token: '123',
        decoded: { a: 1 }
      }
    }));

  it('should get a login error action.', () =>
    expect(actions.loginError('Test', { b: 1 })).toEqual({
      type: types.LOGIN_ERROR,
      payload: {
        message: 'Test',
        extra: { b: 1 }
      }
    }));

  it('generates a sequence of actions when successful login request.', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6InJvb3RAcm9vdC5jb20iLCJleHAiOjE1NTMwMDYyOTF9.xW_yz51nfNASkEPyYiUlEDAQ_CKkWSB9tqjsixkGHsg';
    const username = 'test';
    const password = 'pass123';
    const decoded = jwt_decode(token);

    // Intercept posts to jwt-auth
    fetchMock.once(
      'http://localhost:8000/jwt-auth/',
      {
        token
      }
    );

    // Expected action sequence
    const expectedActions = [
      {
        type: types.LOGIN_START,
        payload: { username }
      },
      {
        type: types.LOGIN_SUCCESS,
        payload: { token, decoded  }
      }
    ]

    // Store mock
    const store = mockStore({
      token: null,
      decoded: null,
      error: {
        message: null,
        extra: null
      }
    })

    return store.dispatch(login(username, password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('generates a sequence of actions when login request fails.', () => {
    const username = 'test';
    const password = 'pass123';
    const errorStatusMessage = "Bad Request"
    const promiseResolvedValue = {
      errors: ["Unable to login. Invalid credentialls"]
    }

    // Intercept posts to jwt-auth
    fetchMock.once(
      'http://localhost:8000/jwt-auth/',
      {
        throws: {
          message: errorStatusMessage,
          promise: Promise.resolve(promiseResolvedValue)
        }
      }
    );

    // Expected action sequence
    const expectedActions = [
      {
        type: types.LOGIN_START,
        payload: { username }
      },
      {
        type: types.LOGIN_ERROR,
        payload: {
          message: errorStatusMessage,
          extra: promiseResolvedValue
        }
      }
    ]

    // Store mock
    const store = mockStore({
      token: null,
      decoded: null,
      error: {
        message: null,
        extra: null
      }
    })

    return store.dispatch(login(username, password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
});