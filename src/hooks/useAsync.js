import { useReducer } from 'react';

import fetchClient from 'utils/fetchClient';

const initialState = {
  isLoading: false,
  error: null,
  data: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isLoading: true,
        data: null,
        error: null,
      };
    case 'SUCCESS':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        error: null,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        data: null,
        error: action.payload,
      };
    default:
      throw Error(`Action ${action.type} doesn't exist!`);
  }
}

export default function useAsync({ method, url, headers, body }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const send = async () => {
    dispatch({ type: 'INIT' });
    try {
      const req = await fetchClient({ method, url, headers, body }).promise;
      dispatch({ type: 'SUCCESS', payload: req.response });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error });
    }
  };

  return { state, send };
}
