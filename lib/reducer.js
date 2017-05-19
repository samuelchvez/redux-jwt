'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorExtra = exports.getErrorMessage = exports.getDecoded = exports.getIsAuth = exports.getToken = undefined;

var _redux = require('redux');

var _types = require('./types');

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var token = function token() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var _ref = arguments[1];
  var type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case types.LOGIN_SUCCESS:
      return payload.token;
    case types.LOGOUT:
    case types.LOGIN_ERROR:
      return "";
    default:
      return state;
  }
};

var decoded = function decoded() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref2 = arguments[1];
  var type = _ref2.type,
      payload = _ref2.payload;

  switch (type) {
    case types.LOGIN_SUCCESS:
      return payload.decoded;
    case types.LOGOUT:
    case types.LOGIN_ERROR:
      return {};
    default:
      return state;
  }
};

var errorMessage = function errorMessage() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var _ref3 = arguments[1];
  var type = _ref3.type,
      payload = _ref3.payload;

  switch (type) {
    case types.LOGIN_START:
    case types.LOGIN_SUCCESS:
    case types.LOGOUT:
      return "";
    case types.LOGIN_ERROR:
      return payload.message;
    default:
      return state;
  }
};

var errorExtra = function errorExtra() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref4 = arguments[1];
  var type = _ref4.type,
      payload = _ref4.payload;

  switch (type) {
    case types.LOGIN_START:
    case types.LOGIN_SUCCESS:
    case types.LOGOUT:
      return {};
    case types.LOGIN_ERROR:
      return payload.extra;
    default:
      return state;
  }
};

var error = (0, _redux.combineReducers)({
  message: errorMessage,
  extra: errorExtra
});

var auth = (0, _redux.combineReducers)({
  token: token,
  decoded: decoded,
  error: error
});

exports.default = auth;
var getToken = exports.getToken = function getToken(state) {
  return state.token;
};
var getIsAuth = exports.getIsAuth = function getIsAuth(state) {
  return getToken(state).length > 0;
};
var getDecoded = exports.getDecoded = function getDecoded(state) {
  return state.decoded;
};
var getErrorMessage = exports.getErrorMessage = function getErrorMessage(state) {
  return state.error.message;
};
var getErrorExtra = exports.getErrorExtra = function getErrorExtra(state) {
  return state.error.extra;
};