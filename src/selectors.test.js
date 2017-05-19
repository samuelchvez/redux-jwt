import deepFreeze from 'deep-freeze';

import * as selectors from './reducer';

const STATE = {
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
}

describe('redux-jwt selectors', () => {
  it('should get the token.', () =>
    expect(selectors.getToken(STATE)).toEqual('12345'));

  it('should get the decoded token.', () =>
    expect(selectors.getDecoded(STATE)).toEqual({
      userId: 100,
      exp: 1500
    }));

  it('should get the error message.', () =>
    expect(selectors.getErrorMessage(STATE)).toEqual('Hello'));

  it('should get if it\'s authenticated.', () =>
    expect(selectors.getIsAuth(STATE)).toEqual(true));

  it('should get the error extra data.', () =>
    expect(selectors.getErrorExtra(STATE)).toEqual({
      a: 1,
      b: 2
    }));
});