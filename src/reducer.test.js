import deepFreeze from 'deep-freeze';

import * as actions from './actions';
import reducer from './reducer';


describe('redux-jwt reducer', () => {
  it('should register token and payload after a successful login. It should clear the error when the login succeeds.', () => {
    const stateBefore = {
      token: "",
      decoded: {},
      error: {
        message: "Some",
        extra: { a: 1 }
      }
    };
    const action = actions.loginSuccess('1512', {exp: 12345678});
    const stateAfter = {
      token: "1512",
      decoded: {
        exp: 12345678
      },
      error: {
        message: "",
        extra: {}
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should clean state after logout.', () => {
    const stateBefore = {
      token: '1512',
      decoded: {
        exp: 12345678
      },
      error: {
        message: "",
        extra: {}
      }
    };
    const action = actions.logout();
    const stateAfter = {
      token: "",
      decoded: {},
      error: {
        message: "",
        extra: {}
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should clean state and add error after login error.', () => {
    const stateBefore = {
      token: '1512',
      decoded: { exp: 123 },
      error: {
        message: "",
        extra: {}
      }
    };

    const action = actions.loginError('Error', {a: 1});
    const stateAfter = {
      token: "",
      decoded: {},
      error: {
        message: 'Error',
        extra: {a: 1}
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should clean error when login starts.', () => {
    const stateBefore = {
      token: "",
      decoded: {},
      error: {
        message: "Test",
        extra: { a: 1 }
      }
    };
    const action = actions.loginStart('test');
    const stateAfter = {
      token: "",
      decoded: {},
      error: {
        message: "",
        extra: {}
      }
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });
});