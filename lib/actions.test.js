'use strict';

require('whatwg-fetch');

var _fetchMock = require('fetch-mock');

var _fetchMock2 = _interopRequireDefault(_fetchMock);

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _types = require('./types');

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middlewares = [_reduxThunk2.default];
var mockStore = (0, _reduxMockStore2.default)(middlewares);

// Mock api
var api = {
  login: function login(username, password) {
    return fetch('http://localhost:8000/jwt-auth/', {
      method: 'POST',
      body: { username: username, password: password }
    }).then(function (res) {
      return res.json();
    }).then(function (_ref) {
      var token = _ref.token;
      return token;
    });
  }
};

var login = actions.login(api.login);

describe('redux-jwt actions', function () {
  it('should get a logout action.', function () {
    return expect(actions.logout()).toEqual({
      type: types.LOGOUT,
      payload: {}
    });
  });

  it('should get a login start action.', function () {
    return expect(actions.loginStart('test')).toEqual({
      type: types.LOGIN_START,
      payload: {
        username: 'test'
      }
    });
  });

  it('should get a login success action.', function () {
    return expect(actions.loginSuccess('123', { a: 1 })).toEqual({
      type: types.LOGIN_SUCCESS,
      payload: {
        token: '123',
        decoded: { a: 1 }
      }
    });
  });

  it('should get a login error action.', function () {
    return expect(actions.loginError('Test', { b: 1 })).toEqual({
      type: types.LOGIN_ERROR,
      payload: {
        message: 'Test',
        extra: { b: 1 }
      }
    });
  });

  it('generates a sequence of actions when successful login request.', function () {
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJ1c2VyX2lkIjoxLCJlbWFpbCI6InJvb3RAcm9vdC5jb20iLCJleHAiOjE1NTMwMDYyOTF9.xW_yz51nfNASkEPyYiUlEDAQ_CKkWSB9tqjsixkGHsg';
    var username = 'test';
    var password = 'pass123';
    var decoded = (0, _jwtDecode2.default)(token);

    // Intercept posts to jwt-auth
    _fetchMock2.default.once('http://localhost:8000/jwt-auth/', {
      token: token
    });

    // Expected action sequence
    var expectedActions = [{
      type: types.LOGIN_START,
      payload: { username: username }
    }, {
      type: types.LOGIN_SUCCESS,
      payload: { token: token, decoded: decoded }
    }];

    // Store mock
    var store = mockStore({
      token: null,
      decoded: null,
      error: {
        message: null,
        extra: null
      }
    });

    return store.dispatch(login(username, password)).then(function () {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('generates a sequence of actions when login request fails.', function () {
    var username = 'test';
    var password = 'pass123';
    var errorStatusMessage = "Bad Request";
    var promiseResolvedValue = {
      errors: ["Unable to login. Invalid credentialls"]
    };

    // Intercept posts to jwt-auth
    _fetchMock2.default.once('http://localhost:8000/jwt-auth/', {
      throws: {
        message: errorStatusMessage,
        promise: Promise.resolve(promiseResolvedValue)
      }
    });

    // Expected action sequence
    var expectedActions = [{
      type: types.LOGIN_START,
      payload: { username: username }
    }, {
      type: types.LOGIN_ERROR,
      payload: {
        message: errorStatusMessage,
        extra: promiseResolvedValue
      }
    }];

    // Store mock
    var store = mockStore({
      token: null,
      decoded: null,
      error: {
        message: null,
        extra: null
      }
    });

    return store.dispatch(login(username, password)).then(function () {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});