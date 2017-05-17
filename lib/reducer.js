'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getError = exports.getDecoded = exports.getToken = undefined;

var _types = require('./types');

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var error = function error() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments[1];
  var type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case types.LOGIN_SUCCESS:
    case types.LOGOUT:
      return {};
    case types.LOGIN_ERROR:
      return payload;
    default:
      return state;
  }
};

var auth = function auth() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref2 = arguments[1];
  var type = _ref2.type,
      payload = _ref2.payload;

  switch (type) {
    case types.LOGIN_SUCCESS:
      var token = payload.token,
          decoded = payload.decoded;

      return { token: token, decoded: decoded };
    case types.LOGOUT:
    case types.LOGIN_ERROR:
      return {
        error: error(state.error, { type: type, payload: payload })
      };
    default:
      return state;
  }
};

exports.default = auth;
var getToken = exports.getToken = function getToken(state) {
  return state.token;
};
var getDecoded = exports.getDecoded = function getDecoded(state) {
  return state.decoded;
};
var getError = exports.getError = function getError(state) {
  return state.error;
};