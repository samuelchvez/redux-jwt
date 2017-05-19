'use strict';

var _deepFreeze = require('deep-freeze');

var _deepFreeze2 = _interopRequireDefault(_deepFreeze);

var _reducer = require('./reducer');

var selectors = _interopRequireWildcard(_reducer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATE = {
  token: '12345',
  decoded: {
    userId: 100,
    exp: 1500
  },
  error: {
    message: "Hello",
    extra: {
      a: 1,
      b: 2
    }
  }
};

describe('redux-jwt selectors', function () {
  it('should get the token.', function () {
    return expect(selectors.getToken(STATE)).toEqual('12345');
  });

  it('should get the decoded token.', function () {
    return expect(selectors.getDecoded(STATE)).toEqual({
      userId: 100,
      exp: 1500
    });
  });

  it('should get the error message.', function () {
    return expect(selectors.getErrorMessage(STATE)).toEqual('Hello');
  });

  it('should get if it\'s authenticated.', function () {
    return expect(selectors.getIsAuth(STATE)).toEqual(true);
  });

  it('should get the error extra data.', function () {
    return expect(selectors.getErrorExtra(STATE)).toEqual({
      a: 1,
      b: 2
    });
  });
});