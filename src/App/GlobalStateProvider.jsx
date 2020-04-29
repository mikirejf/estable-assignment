import React from 'react';
import PropTypes from 'prop-types';

import { getStoredAuthTokens } from 'utils/authTokens';

const GlobalStateContext = React.createContext();
const initialState = {
  authenticated: !!getStoredAuthTokens() || false,
};

function stateReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
      };
    default: {
      throw Error(`Unknown dispatch action '${action.type}'!`);
    }
  }
}

function GlobalStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

GlobalStateProvider.defaultProps = {
  children: null,
};

GlobalStateProvider.propTypes = {
  children: PropTypes.node,
};

function useGlobalState() {
  const context = React.useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}

export { GlobalStateProvider, useGlobalState };
