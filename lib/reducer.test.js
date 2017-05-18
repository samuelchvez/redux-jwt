'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('redux-jwt reducer', function () {
  it('should register token and payload after a successful login. It should clear the error when the login succeeds.', function () {
    var stateBefore = {
      token: null,
      decoded: null,
      error: {
        message: "Some",
        extra: { a: 1 }
      }
    };
    var action = actions.loginSuccess('1512', { exp: 12345678 });
    var stateAfter = {
      token: "1512",
      decoded: {
        exp: 12345678
      },
      error: {
        message: null,
        extra: null
      }
    };

    (0, _deepFreeze2.default)(stateBefore);
    (0, _deepFreeze2.default)(action);

    expect((0, _reducer2.default)(stateBefore, action)).toEqual(stateAfter);
  });

  it('should clean state after logout.', function () {
    var stateBefore = {
      token: '1512',
      decoded: {
        exp: 12345678
      },
      error: {
        message: null,
        extra: null
      }
    };
    var action = actions.logout();
    var stateAfter = {
      token: null,
      decoded: null,
      error: {
        message: null,
        extra: null
      }
    };

    (0, _deepFreeze2.default)(stateBefore);
    (0, _deepFreeze2.default)(action);

    expect((0, _reducer2.default)(stateBefore, action)).toEqual(stateAfter);
  });

  it('should clean state and add error after login error.', function () {
    var stateBefore = {
      token: '1512',
      decoded: { exp: 123 },
      error: {
        message: null,
        extra: null
      }
    };

    var action = actions.loginError('Error', { a: 1 });
    var stateAfter = {
      token: null,
      decoded: null,
      error: {
        message: 'Error',
        extra: { a: 1 }
      }
    };

    (0, _deepFreeze2.default)(stateBefore);
    (0, _deepFreeze2.default)(action);

    expect((0, _reducer2.default)(stateBefore, action)).toEqual(stateAfter);
  });

  it('should clean error when login starts.', function () {
    var stateBefore = {
      token: null,
      decoded: null,
      error: {
        message: "Test",
        extra: { a: 1 }
      }
    };
    var action = actions.loginStart('test');
    var stateAfter = {
      token: null,
      decoded: null,
      error: {
        message: null,
        extra: null
      }
    };

    (0, _deepFreeze2.default)(stateBefore);
    (0, _deepFreeze2.default)(action);

    expect((0, _reducer2.default)(stateBefore, action)).toEqual(stateAfter);
  });
});