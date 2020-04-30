import React from 'react';
import { render } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom/matchers';

import { GlobalStateProvider } from 'App/GlobalStateProvider';
import LoginForm from 'App/components/LoginForm';

expect.extend({ toBeInTheDocument });

const { getByLabelText, getByText } = render(
  <GlobalStateProvider>
    <LoginForm />
  </GlobalStateProvider>
);

describe('LoginForm', () => {
  const emailInput = getByLabelText('Email');
  const passwordInput = getByLabelText('Password');
  const loginButton = getByText('Login');

  test('it renders', () => {
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
