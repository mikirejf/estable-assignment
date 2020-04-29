import { useReducer } from 'react';

import {
  storeAuthToken,
  getStoredAuthToken,
  removeStoredAuthToken,
} from 'utils/authToken';
import { useGlobalState } from 'App/GlobalStateProvider';
import fetchClient from 'utils/fetchClient';
import endpoints from 'utils/endpoints';

const initialState = {
  isLoading: false,
  error: null,
  response: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isLoading: true,
        response: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        ...state,
        isLoading: false,
        response: action.payload,
        error: null,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        response: null,
        error: action.payload,
      };
    default:
      throw Error(`Action ${action.type} doesn't exist!`);
  }
}

async function generateTokenRefreshRequest(oldAuthTokens) {
  return fetchClient({
    method: 'POST',
    url: endpoints.tokenRefresh,
    headers: { 'content-type': 'application/json' },
    body: oldAuthTokens,
  }).promise;
}

export default function useAsync({ method, url, headers, body }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dispatch: globalDispatch } = useGlobalState();
  const authToken = getStoredAuthToken();

  const logout = () => {
    removeStoredAuthToken();
    globalDispatch({ type: 'LOGOUT' });
  };

  const generateRequest = () => {
    let requestHeaders = headers;
    if (authToken) {
      requestHeaders = {
        ...headers,
        authorization: `Bearer ${authToken.token}`,
      };
    }
    return fetchClient({ method, url, headers: requestHeaders, body }).promise;
  };

  const send = async () => {
    dispatch({ type: 'INIT' });
    try {
      const response = await generateRequest();
      dispatch({ type: 'SUCCESS', payload: response });
    } catch (error) {
      const errorObj = JSON.parse(error.message);

      if (errorObj.status === 401) {
        if (authToken) {
          try {
            const newAuthTokens = await generateTokenRefreshRequest(authToken);
            storeAuthToken(newAuthTokens);
            try {
              const retryResponse = await generateRequest();
              dispatch({ type: 'SUCCESS', payload: retryResponse });
            } catch (retryError) {
              dispatch({ type: 'ERROR', payload: retryError });
            }
          } catch (tokenRefreshError) {
            logout();
          }
        } else {
          logout();
        }
      } else {
        dispatch({ type: 'ERROR', payload: error });
      }
    }
  };

  return { state, send };
}
