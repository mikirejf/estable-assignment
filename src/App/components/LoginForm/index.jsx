import React, { useEffect, useState, Fragment } from 'react';

import { storeAuthTokens } from 'utils/authTokens';
import { useGlobalState } from 'App/GlobalStateProvider';
import toast from 'utils/toast';
import useApi from 'hooks/useApi';

import { Container, Label, Input, Button, StyledSpinner } from './Styles';

function generateErrorToastMessage(errorMessage) {
  const errorObj = JSON.parse(errorMessage);
  const errorResponseFields = Object.keys(errorObj.response);
  const errors = errorResponseFields.reduce((temp, field) => {
    const fieldErrors = errorObj.response[field];
    return [...temp, ...fieldErrors];
  }, []);

  return errors.map((error) => (
    <Fragment key={error}>
      - {error}
      <br />
    </Fragment>
  ));
}

export default function LoginForm() {
  const { dispatch } = useGlobalState();
  const [
    { isLoading, response, error },
    submitForm,
  ] = useApi.post('/users/account/login', { lazy: true });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm({ email, password });
  };

  useEffect(() => {
    if (response) {
      storeAuthTokens(response);
      dispatch({ type: 'LOGIN' });
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (error) {
      toast.add({
        type: 'error',
        message: generateErrorToastMessage(error.message),
        duration: 5,
      });
    }
  }, [error]);

  return (
    <Container onSubmit={handleSubmit}>
      <Label>
        Email
        <Input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>
      <Label>
        Password
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <StyledSpinner size="30px" /> : 'Login'}
      </Button>
    </Container>
  );
}
