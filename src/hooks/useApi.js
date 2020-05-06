import { useReducer, useEffect, useCallback } from 'react';

import { useGlobalState } from 'App/GlobalStateProvider';
import api from 'utils/api';
import toast from 'utils/toast';

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

function useApi(endpoint, { body: initialBody, lazy = false } = {}) {
  const { dispatch: globalDispatch } = useGlobalState();
  const initialState = {
    data: null,
    error: null,
    isLoading: !lazy,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const onLogout = () => {
    globalDispatch({ type: 'LOGOUT' });
    toast.add({
      type: 'info',
      message: 'You were logged out. Please log in again.',
    });
  };

  const makeRequest = useCallback(async (body) => {
    dispatch({ type: 'INIT' });
    try {
      const response = await api.post(endpoint, body || initialBody, onLogout);
      dispatch({
        type: 'SUCCESS',
        payload: response,
      });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!lazy) {
      makeRequest();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [{ ...state }, makeRequest];
}

/* eslint-disable react-hooks/rules-of-hooks */
export default {
  post: (endpoint, options) => useApi(endpoint, options),
};
