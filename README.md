[![Build Status](https://travis-ci.org/samuelchvez/redux-jwt.svg?branch=master)](https://travis-ci.org/samuelchvez/redux-jwt) [![codecov.io Code Coverage](https://img.shields.io/codecov/c/github/samuelchvez/redux-jwt.svg?maxAge=2592000)](https://codecov.io/github/samuelchvez/redux-jwt?branch=master) [![Dependency Status](https://david-dm.org/samuelchvez/redux-jwt.svg)](https://david-dm.org/samuelchvez/redux-jwt) [![devDependencies Status](https://david-dm.org/samuelchvez/redux-jwt/dev-status.svg)](https://david-dm.org/samuelchvez/redux-jwt?type=dev) [![Code Climate](https://codeclimate.com/github/samuelchvez/redux-jwt/badges/gpa.svg)](https://codeclimate.com/github/samuelchvez/redux-jwt)

[![NPM Download Stats](https://nodei.co/npm/nozzmo-redux-jwt.png?downloads=true)](https://www.npmjs.com/package/nozzmo-redux-jwt)

# Redux JWT

Easy to use JWT authentication management library for [Redux](http://redux.js.org/).

## Installation

Configure auth reducer in your main reducer:

```
npm install nozzmo-redux-jwt --save
```

## Use

Configure auth reducer in your main reducer:

```Javascript
// In reducers/index.js
import { combineReducers } from 'redux';

// Other reducers as example, redux-jwt don't rely on them.
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';

// Import reducer and selectors (optional)
import { reducer as auth, selectors as fromAuth } from 'nozzmo-redux-jwt';

const reducer = combineReducers({
  routing: routerReducer,
  form,
  auth, // Combine it in your main reducer
});

export default reducer;
```

And in your action creators file:

```Javascript
// In actions/index.js
import { actions as authActions } from 'nozzmo-redux-jwt';

// Import your api login service
import * as api from '../api';

// Apply api.login as the unique param for authActions.login.
// This returns a thunk described below
export const login = authActions.login(api.login);
```

This creates a thunk with the following signature:
```Javascript
(username, password) => dispatch => { /* ... */ }
```

## API login function

In order to configure the login action creator you must pass your API login function as the unique parameter for `authActions.login`. Your API login function should return a promise resolving into a token, for example:

```Javascript
// In api/index.js

export const login = (username, password) =>
  fetch(
    'http://localhost:8000/api/v1/token-auth',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username,
        password
      }
    }
  ).then(
    response => {
      const { status, statusText } = response;

      if (status >= 200 && status < 300)
        return response.json();

      let error = new Error(statusText);
      error.status = status;
      error.promise = response.json();
      throw error;
    }
  ).then({ token } => token);

```

## Added state shape

After configured, your state shape will be incremented by the following object:

```Javascript
{
  ...state,
  auth: {
    token: 'example',
    decoded: {
      exampleKey1: 1,
      exampleKey2: 2,
    },
    error: {
      message: 'example',
      extra: {
        exampleKey3: 3,
        exampleKey4: 4,
      }
    }
  }
}
```

The `decoded` part and `error.extra` will depend on your backend response. `decoded` will contain the decoded token returned from your login api endpoint. `error.extra` will contain the body of the response returned from your login api endpoint if the login was unsuccessful. To actually handling the error response like this, you should nourish your api login function thrown error with a promise attribute:

```Javascript

// ...
.then(
  response => {
    const { status, statusText } = response;

    if (status >= 200 && status < 300)
      return response.json();

    // Look how I added a promise attribute to the thrown error!
    let error = new Error(statusText);
    error.status = status;
    error.promise = response.json();
    throw error;
  }
)

```

If you decide not adding the promise attribute, `error.extra` will hold the full returned error reference.

## Actions generated

Consider the followint two scenarios:

### Successful login

```Javascript
const expectedActions = [
  {
    type: '@@redux-jwt/LOGIN_START',
    payload: { username }
  },
  {
    type: '@@redux-jwt/LOGIN-SUCCESS',
    payload: { token, decoded  }
  }
]
```

### Unsuccessful login attempt

```Javascript
const expectedActions = [
  {
    type: '@@redux-jwt/LOGIN_START',
    payload: { username }
  },
  {
    type: '@@redux-jwt/LOGIN-ERROR',
    payload: { message, extra }
  }
]
```

## Contributors

[@samuelchvez](https://github.com/samuelchvez)

## License

Copyright (c) 2017 Samuel Chávez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
