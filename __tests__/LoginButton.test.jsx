import React from 'react';
import { render } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';

import { GlobalStateProvider } from 'App/GlobalStateProvider';
import LoginButton from 'App/components/LoginButton';

expect.extend({ toBeInTheDocument });

const { getByText } = render(
  <GlobalStateProvider>
    <LoginButton />
  </GlobalStateProvider>
);

describe('LoginButton', () => {
  const loginButton = getByText('Login as Andrej Premrn');

  test('it renders', () => {
    expect(loginButton).toBeInTheDocument();
  });
});
