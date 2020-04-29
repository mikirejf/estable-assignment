import React from 'react';

import Container from './components/Container';
import LoginButton from './components/LoginButton';
import { GlobalStateProvider } from './GlobalStateProvider';

import BaseStyles from './BaseStyles';
import NormalizeStyles from './NormalizeStyles';

function App() {
  console.log('render');
  return (
    <GlobalStateProvider>
      <NormalizeStyles />
      <BaseStyles />
      <Container>
        <LoginButton />
      </Container>
    </GlobalStateProvider>
  );
}

export default App;
