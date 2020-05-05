import React from 'react';

import Page from 'App/components/Page';
import Toasts from 'App/components/Toasts';
import { GlobalStateProvider } from './GlobalStateProvider';

import BaseStyles from './BaseStyles';
import NormalizeStyles from './NormalizeStyles';

function App() {
  return (
    <GlobalStateProvider>
      <NormalizeStyles />
      <BaseStyles />
      <Toasts />
      <Page />
    </GlobalStateProvider>
  );
}

export default App;
