import React from 'react';

import Page from 'App/components/Page';
import { GlobalStateProvider } from './GlobalStateProvider';

import BaseStyles from './BaseStyles';
import NormalizeStyles from './NormalizeStyles';

function App() {
  return (
    <GlobalStateProvider>
      <NormalizeStyles />
      <BaseStyles />
      <Page />
    </GlobalStateProvider>
  );
}

export default App;
