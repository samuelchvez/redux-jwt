'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.loginError = exports.loginSuccess = exports.loginStart = exports.logout = undefined;

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _types = require('./types');

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var logout = exports.logout = function logout() {
  return {
    type: types.LOGOUT,
    payload: {}
  };
};

var loginStart = exports.loginStart = function loginStart(username) {
  return {
    type: types.LOGIN_START,
    payload: { username: username }
  };
};

var loginSuccess = exports.loginSuccess = function loginSuccess(token, decoded) {
  return {
    type: types.LOGIN_SUCCESS,
    payload: { token: token, decoded: decoded }
  };
};

var loginError = exports.loginError = function loginError(message, extra) {
  return {
    type: types.LOGIN_ERROR,
    payload: { message: message, extra: extra }
  };
};

var login = function login(_ref) {
  var apiLogin = _ref.apiLogin;
  return function (username, password) {
    return function (dispatch) {

      dispatch(loginStart(username));

      return apiLogin(username, password).then(function (token) {
        var decoded = (0, _jwtDecode2.default)(token);
        dispatch(loginSuccess(token, decoded));
        return { token: token, decoded: decoded };
      }).catch(function (e) {
        var message = e.message,
            promise = e.promise,
            rest = _objectWithoutProperties(e, ['message', 'promise']);

        if ((0, _isPromise2.default)(e)) return e.then(function (extra) {
          return dispatch(loginError(message, extra));
        });

        if ((0, _isPromise2.default)(promise)) return promise.then(function (extra) {
          return dispatch(loginError(message, extra));
        });

        loginError(message, e);

        throw e;
      });
    };
  };
};
exports.login = login;